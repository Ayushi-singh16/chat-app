const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Always expect object from client and broadcast as object
  socket.on('message', (msg) => {
    const messageObj = typeof msg === 'string' ? { user: 'Anonymous', text: msg } : msg;
    io.emit('message', messageObj);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Socket.IO server running');
});

// Changed port from 5000 to 5001
server.listen(8080, () => console.log('Server running on http://localhost:8080'));