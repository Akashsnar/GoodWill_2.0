import { useEffect, useState } from "react";
import moment from "moment";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {
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
    <div className="chat-window">
      <div className="chat-header">
        <p>GoodWill-helpdesk</p>
      </div>
      <div className="chat-body">
        <div className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
