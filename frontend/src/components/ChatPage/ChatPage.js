import "./ChatPage.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Chat from "./Chat";

function ChatPage() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    console.log(newSocket);
    setSocket(newSocket);
  }, []);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="ChatPage">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>GoodWill-HelpDesk</h3>
          <input
            type="text"
            placeholder="Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default ChatPage;
