import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../css/ChatApp.css'

const socket = io('http://localhost:5000');

function ChatApp() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off('receive_message');
  }, []);

  const sendMessage = () => {
    socket.emit('send_message', message)  ;
    setMessage('');
  };

  return (
   <div className="chat-wrapper">
  {/* <h1 className="chat-title">ChatSync </h1> */}
  
  <div className="chat-messages">
    {chat.map((msg, index) => (
      <p key={index} className="chat-message">{msg}</p>
    ))}
  </div>
  
  <div className="chat-input-wrapper">
    <input
      className="chat-input"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
      placeholder="Type your message..."
      required
    />
    <button
  
      
    className="chat-send-button" onClick={()=>message===""?alert("Write Message"):sendMessage()}>Send</button>
  </div>
</div>

  );
}

export default ChatApp;  
