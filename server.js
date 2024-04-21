const https = require('https')
const express = require('express');
const app = express();
const socketio = require('socket.io');
app.use(express.static(__dirname))

const serverWithSocket = app.listen(5000, () => {
  console.log(`server listens at ${5000}`);

});

const io = require('socket.io')(serverWithSocket, {
  cors: true
});


io.on("connection", (socket) => {
  console.log("connected socket id " + socket.id)
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    console.log("hittted")
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  });
});