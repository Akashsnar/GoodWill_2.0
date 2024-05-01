import { useEffect, useState } from "react";
import moment from "moment";
import ScrollToBottom from "react-scroll-to-bottom";
import './Chat.css'
import { useSelector } from 'react-redux';

const Chat = ({ socket, username, room }) => {
  const name = useSelector((state) => state.auth.name);
  const email = useSelector((state) => state.auth.email);   

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      let messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()),
      };
      console.log("");
      await socket.emit("send_message", messageData);
      messageData.time =
        messageData.time.getHours() + ":" + messageData.time.getMinutes();
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      let newMessage = {
        room: data.room,
        author: data.username,
        message: data.message,
        time: moment(data.time).format("HH:mm"),
      };
      setMessageList((list) => [...list, newMessage]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  return (
    <div className="helpline_container">
      <div className="helpline_header">HelpLine Desk</div>
      <div className="chat_container">
        {messageList.map((message) => {

        })}
      </div>
      <div className="chat_input">

      </div>
    </div>
  );
};

export default Chat;