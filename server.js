const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let itemList = [];

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the current list to the newly connected client
  socket.emit('updateList', itemList);

  // Handle new item submissions
  socket.on('addItem', (item) => {
    itemList.push(item);
    io.emit('updateList', itemList);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server started on port 3000');
});
