import React, { useEffect, useState } from 'react'
import NavAdmin from "./NavAdmin"
import Sidebar from './Sidebar';
import "./AdminChat.css";
import "./AdminDashboard.css";
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const AdminChat = () => {
    const [messageList, setMessageList] = useState([]);
    const [users, setUsers] = useState([]);
    const emailId = useSelector((state) => state.auth.email);
    const [userId, setUserId] = useState();
    const [adminId, setAdminId] = useState();
    const [socket, setSocket] = useState();
    const [inputMessage, setInputMessage] = useState("");
    console.log("emailId ", emailId);
    useEffect(() => {
        const getUsers = async () => {
            const response = await fetch("http://localhost:4000/sitedata/chatlists");
            const data = await response.json();
            console.log(data);
            setUsers(data);
        }
        getUsers();
        if (userId) {
            const tempdataget = async (user_id) => {
                setUserId(user_id);
                const response = await fetch(`http://localhost:4000/helpline/admin/${userId}`);
                const data = await response.json();
                console.log(data);
                const { admin_id, messages } = data;
                console.log(" user_id ", user_id, admin_id, messages);
                setAdminId(admin_id);
                setMessageList(messages);
                // print();
            }
            tempdataget();
        }
    }, []);

    useEffect(() => {
        const userSocket = io('http://localhost:4000', {
            query: {
                email: emailId,
            },
        });

        setSocket(userSocket);
        console.log(userSocket);
        userSocket.on("recieve-message", async (data) => {
            console.log(messageList)
            const newMessagesList = [...messageList, data];
            console.log("newm ", newMessagesList);
            setMessageList(newMessagesList);
        })

        // return () => {
        //   userSocket.disconnect();
        // };
    }, [])



    const handleUserChange = async (user_id) => {
        setUserId(user_id);
        const response = await fetch(`http://localhost:4000/helpline/admin/${userId}`);
        const data = await response.json();
        console.log(data);
        const { admin_id, messages } = data;
        console.log(" user_id ", user_id, admin_id, messages);
        setAdminId(admin_id);
        setMessageList(messages);
        // print();
    }

    const formatCurrentTime = () => {
        const currentDate = new Date();

        let hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();

        return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };

    const handleSendMessage = async () => {
        const data = {
            content: inputMessage,
            senderId: adminId,
            receiverId: userId,
            roomId: userId
        };
        await socket.emit("send-message", data);

        const newMessage = {
            senderId: adminId,
            content: inputMessage,
            time: formatCurrentTime()
        };

        const newMessagesList = [...messageList, newMessage];
        setMessageList(newMessagesList);
        setInputMessage("");
    }

    const handleInputChange = (event) => {
        setInputMessage(event.target.value);
    };
    return (
        <>
            <NavAdmin />
            <div className="mainContainer">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="mainContent">
                    <div className="helpline_containerss">
                        <div className="helpline_header">HelpLine Desk</div>
                        <div className='helpline_middle'>
                            <div className='chatlists'>
                                {users.map((user) => {
                                    return <button className={` ${userId === user._id ? 'selected-user' : ''}`} onClick={() => handleUserChange(user._id)}>{user.email}</button>
                                })}
                            </div>
                            <div className='iamtwo'>
                                <div className='container_chat_contain'>
                                    <div className="chat_container ">
                                        {messageList.map((message, index) => (
                                            <div key={index} className={`message ${message.senderId === userId ? "chat_div_content_receiver":  "chat_div_content_sender"}`} >
                                                <div className={`message ${message.senderId === userId ?  "receiver_message" :"sender_message" }`}>
                                                    {message.content}
                                                    <p className="message_time">{message.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="chat_input">
                                        <input type="text" placeholder="Type your message here" id="send-message" name="sendmessage"
                                            value={inputMessage} onChange={handleInputChange} />
                                        <button className="send_button" onClick={handleSendMessage}>Send Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminChat