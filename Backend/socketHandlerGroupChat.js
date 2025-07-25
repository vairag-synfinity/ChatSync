
const users = {};
const socketHandlerGroupChat = (io) => {


io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  socket.on("join_group_room", ({ name, room }) => {
    users[socket.id] = { name, room };
    // console.log("------------------------------"+users[socket.id]);

    socket.join(room);
    socket.to(room).emit("receive_group_message", {
      user: "system",
      text: `${name} joined the room.`
    });
  });

  socket.on("send_group_message", ({ room, user, message }) => {
    io.to(room).emit("receive_group_message", { user, text: message });
  });

  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit("receive_group_message", {
        user: "system",
        text: `${user.name} left the room.`
      });
      delete users[socket.id];
    }
    console.log("User disconnected:", socket.id);
  });
});

}


module.exports = socketHandlerGroupChat;
