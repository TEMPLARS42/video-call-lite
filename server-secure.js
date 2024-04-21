const ADDRESS = '192.168.1.7';
const PORT = 5000;
const MAX_CLIENTS = 50;
const secure = true;

let os = require('os');
let app = null;
let host = '';
if (secure === true) {
    const fs = require('fs');
    const options = {
        key: fs.readFileSync('./client-key.pem'),
        cert: fs.readFileSync('./client-cert.pem')
    };
    host = 'https';
    app = require('https').createServer(options, () => {
        console.log("connected")
    });
} else {
    host = 'http';
    app = require('http').createServer(() => {
        console.log("connected")
    });
}

let io = require('socket.io')(app, {
    cors: true
});

app.listen(PORT, ADDRESS);
console.log(`Socket.io server listening on: ${host}://${ADDRESS}:${PORT}`);

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