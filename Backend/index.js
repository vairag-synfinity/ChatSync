const express = require('express');  
const http = require('http');  
const socketIo = require('socket.io');  
const mongoose = require('mongoose');  
const cors = require('cors');  
require('dotenv').config();  
const Message = require('./models/Message');


const app = express();  
const server = http.createServer(app);  
const io = socketIo(server, { cors: { origin: '*' } });  

app.use(cors());  
app.use(express.json());  

mongoose.connect(process.env.MONGO_URI)  
  .then(() => console.log('MongoDB Connected'))  
  .catch(err => console.log(err));  


  app.use('/api/auth', require('./routes/auth'));

// Protected Example Route
app.get('/api/protected', require('./middleware/auth'), (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
 // <-- Import the model

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send all previous messages to the newly connected client
  Message.find()
    .sort({ createdAt: 1 })
    .then(messages => {
      messages.forEach(msg => socket.emit('receive_message', msg.text));
    });

  socket.on('send_message', async (data) => {
    try {
      const message = new Message({ text: data, senderId: socket.id });
      await message.save();

      io.emit('receive_message', data); // Broadcast to all clients
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


server.listen(process.env.PORT, () => console.log(`Server running on port localhost:${process.env.PORT}`));  
