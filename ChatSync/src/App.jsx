import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function ChatApp() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userid, setUserId] = useState([])

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((message) => [...message, data]);
      setUserId((userid) => [...userid, socket.id])
      console.log(socket.id)
    });

    return () => {
      socket.off('receive_message');

    };
  }, []);

  const sendMessage = () => {
    // if (message.trim() === '') return;
    socket.emit('send_message', message);
    setMessage('');
  };

  return (
    <div className="p-4">
      <h2>Chat App</h2>
      <div >

        {chat.map((msg, index) => (
          <div key={index}>
            <p>{userid[index]}</p>
            <p>{msg}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
