import React, { useCallback, useEffect, useRef, useState } from 'react'
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
    const scrollRef = useRef(null);
    const onlineUsers = useRef(new Set());

    console.log("emailId ", emailId);
    useEffect(() => {
        const getUsers = async () => {
            const response = await fetch("http://localhost:4000/sitedata/chatlists");
            const data = await response.json();
            console.log(data);
            setUsers(data);
            setUserId(data[0]._id);
            const response2 = await fetch(`http://localhost:4000/helpline/admin/${data[0]._id}`);
            const data2 = await response2.json();
            console.log(data2.messages);
            setMessageList(data2.messages);
        }
        getUsers();
    }, []);

    const method = useCallback(async (data) => {
        console.log("in socket recieve ", data.senderId, userId);
        if(data.senderId == userId) {
            const newMessagesList = [...messageList, data];
            setMessageList(newMessagesList);
        }

        
    }, [userId, messageList])

    useEffect(() => {
        const userSocket = io('http://localhost:4000', {
            query: {
                email: emailId,
            },
        });

        setSocket(userSocket);
        console.log(userSocket);
        userSocket.on("recieve-message", method)
        userSocket.on("online-user", (data) => {
            onlineUsers.current.add(data)
        })
        userSocket.on("offline-user", (data) => {
            onlineUsers.current.delete(data);
        })
        // return () => {
        //   userSocket.disconnect();
        // };
    }, [method])



    const handleUserChange = async (user_id) => {
        setUserId(user_id);
        const response = await fetch(`http://localhost:4000/helpline/admin/${user_id}`);
        const data = await response.json();
        const { admin_id, messages } = data;
        console.log(" user_id ", user_id, admin_id, messages);
        setAdminId(admin_id);
        setMessageList(messages);
        // print();
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messageList])

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
                                    return <button onClick={() => handleUserChange(user._id)}>
                                        {userId == user._id && <div><b>{user.email}</b></div>}
                                        {userId != user._id && <div>{user.email}</div>}
                                        {onlineUsers.current.has(user._id) && <p style={{
                                            color: "#0BDA51"
                                        }}>Online</p>}
                                        {!onlineUsers.current.has(user._id) && <p>Offline</p>}
                                    </button>
                                })}
                            </div>
                            <div className='iamtwo'>
                                <div className='container_chat_contain'>
                                    <div className="chat_container" ref={scrollRef}>
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