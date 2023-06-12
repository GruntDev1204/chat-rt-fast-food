const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
const cors = require('cors');
const port = process.env.PORT || 3001;


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('chat-message', (  message) => {
    io.emit('chat-message',  message);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
