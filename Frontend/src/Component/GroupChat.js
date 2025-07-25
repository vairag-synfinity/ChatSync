
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://192.168.1.120:5000");

export default function GroupChat() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
  const handleReceiveMessage = (data) => {
    setMessages((prev) => [...prev, data]);
  };

  socket.on("receive_group_message", handleReceiveMessage);

  return () => {
    socket.off("receive_group_message", handleReceiveMessage);
  };
}, []);

  const joinRoom = () => {
    if (name && room) {
      socket.emit("join_group_room", { name, room });
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message) {
      socket.emit("send_group_message", { room, user: name, message });
      setMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <div>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && joinRoom()}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div>
          <div style={{ border: "1px solid gray", height: 300, overflowY: "auto" }}>
            {messages.map((msg, i) => (
              <div key={i}>
                <strong>{msg.user}</strong>: {msg.text}
              </div>
            ))}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}


