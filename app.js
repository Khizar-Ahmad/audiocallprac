const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize express and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When an offer is received, broadcast it to the other peer
  socket.on('offer', ({ offer, roomId }) => {
    socket.to(roomId).emit('offer', offer);
  });

  // When an answer is received, broadcast it to the other peer
  socket.on('answer', ({ answer, roomId }) => {
    socket.to(roomId).emit('answer', answer);
  });

  // When an ICE candidate is received, broadcast it to the other peer
  socket.on('ice-candidate', ({ candidate, roomId }) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files (like the client-side code) from the "public" directory
app.use('/',express.static('public'));

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});