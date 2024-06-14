const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const ChatMessage = require('./src/models/ChatMessage');

const initializeWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      const { token, roomId, text } = JSON.parse(message);

      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return ws.send(JSON.stringify({ error: 'Authentication error' }));
        }

        const chatMessage = new ChatMessage({
          roomId,
          userId: decoded.id,
          text,
          createdAt: Date.now(),
          expiresAt: Date.now() + 60 * 60 * 1000, // 1시간 후 만료
        });

        await chatMessage.save();

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
            client.send(JSON.stringify({
              userId: decoded.id,
              text,
              createdAt: chatMessage.createdAt
            }));
          }
        });
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
};

module.exports = initializeWebSocketServer;
