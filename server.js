const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

// Create an Express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 8080;

// Serve static files for the client
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket signaling server logic
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Broadcast the message to all connected clients except the sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
