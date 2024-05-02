// import { useEffect, useState } from "react";
// import './ChatPage.css'
// import { useSelector } from 'react-redux';
// import io from 'socket.io-client';

// const ChatPage = () => {
//   const name = useSelector((state) => state.auth.name);
//   const emailId = useSelector((state) => state.auth.email);
//   const [inputMessage, setInputMessage] = useState("");
//   console.log("UserID ", emailId);
//   const [socket, setSocket] = useState();
//   const [messageList, setMessageList] = useState([]);

//   const [userId, setUserId] = useState();
//   const [adminId, setAdminId] = useState();
//   useEffect(() => {
//     const userSocket = io('http://localhost:4000', {
//       query: {
//         email: emailId,
//       },
//     });

//     console.log("UserSocekt ", userSocket)
//     setSocket(userSocket);

//     userSocket.on("recieve-message", async (data) => {
//       console.log("message list ", messageList)
//       const newMessagesList = [...messageList, data];
//       console.log("newm ", newMessagesList);
//       setMessageList(newMessagesList);
//     })
//   }, [])

//   const formatCurrentTime = () => {
//     const currentDate = new Date();

//     let hours = currentDate.getHours();
//     const minutes = currentDate.getMinutes();

//     return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
//   };
//   // const [currentMessage, setCurrentMessage] = useState("");



//   useEffect(() => {
//     const getData = async () => {
//       const response = await fetch(`http://localhost:4000/helpline/user-details/${emailId}`);
//       const data = await response.json();
//       console.log(data);
//       const { user_id, admin_id, messages } = data;
//       console.log(" user_id ", user_id, admin_id, messages);
//       setUserId(user_id);
//       setAdminId(admin_id);
//       setMessageList(messages);
//     }
//     getData();
//   }, []);



//   const handleSendMessage = async () => {
//     const data = {
//       content: inputMessage,
//       senderId: userId,
//       receiverId: adminId,
//       roomId: userId
//     };
//     await socket.emit("send-message", data);

//     const newMessage = {
//       senderId: userId,
//       content: inputMessage,
//       time: formatCurrentTime()
//     };

//     const newMessagesList = [...messageList, newMessage];
//     setMessageList(newMessagesList);
//     setInputMessage("");
//   }

//   const handleInputChange = (event) => {
//     setInputMessage(event.target.value);
//   };

//   return (
//     <div className="helpline_container">
//       <div className="helpline_header">HelpLine Desk</div>
//       <div className="chat_container">
//         {messageList.map((message) => {
//           return <div>{message.content}</div>
//         })}
//       </div>
//       <div className="chat_input">
//         <input type="text" placeholder="Type your message here" value={inputMessage} id="send-message" name="sendmessage" onChange={handleInputChange} />
//         <button onClick={handleSendMessage}>Send Message</button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

import { useEffect, useRef, useState } from "react";
import './ChatPage.css'
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const ChatPage = () => {
  const emailId = useSelector((state) => state.auth.email);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState();
  const [messageList, setMessageList] = useState([]);
  const [adminOnline, setAdminOnline] = useState(false)
  const [userId, setUserId] = useState();
  const [adminId, setAdminId] = useState();
  const scrollRef = useRef(null);


  useEffect(() => {
    const userSocket = io('http://localhost:4000', {
      query: {
        email: emailId,
      },
    });

    setSocket(userSocket);

    userSocket.on("recieve-message", (data) => {
      setMessageList(prevMessages => [...prevMessages, data]);
    })

    userSocket.on("online-admin", () => {
      setAdminOnline(true);
    })

    userSocket.on("offline-admin", () => {
      setAdminOnline(false);
    })
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:4000/helpline/user-details/${emailId}`);
      const data = await response.json();
      const { user_id, admin_id, messages } = data;
      setUserId(user_id);
      setAdminId(admin_id);
      setMessageList(messages);
    }
    fetchData();
  }, [emailId]);

  const formatCurrentTime = () => {
    const currentDate = new Date();
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messageList])

  const handleSendMessage = async () => {
    const data = {
      content: inputMessage,
      senderId: userId,
      receiverId: adminId,
      roomId: userId
    };
    await socket.emit("send-message", data);

    const newMessage = {
      senderId: userId,
      content: inputMessage,
      time: formatCurrentTime()

    };

    setMessageList(prevMessages => [...prevMessages, newMessage]);
    setInputMessage("");
  }

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  return (
    <div className="main_chat_container">
      <div className="helpline_container">
        <div className="helpline_header">
          <b>HelpLine Desk</b>
          {adminOnline && <p>Online</p>}
          {!adminOnline && <p>Offline</p>}
        </div>
        <div className="chat_container" ref={scrollRef}>
          {messageList.map((message, index) => (
            <div key={index} className={`message ${message.senderId === userId ? "chat_div_content_sender" : "chat_div_content_receiver"}`} >
              <div className={`message ${message.senderId === userId ? "sender_message" : "receiver_message"}`}>
                {message.content}
                <p className="message_time">{message.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chat_input">
          <input type="text" placeholder="Type your message here" value={inputMessage} onChange={handleInputChange} />
          <button className="send_button" onClick={handleSendMessage}>Send Message</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
