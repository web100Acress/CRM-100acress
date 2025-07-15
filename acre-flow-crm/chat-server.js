// chat-server.js (ESM version)
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4000;
const HISTORY_FILE = path.join(__dirname, 'chat-history.json');

let chatHistory = [];
if (fs.existsSync(HISTORY_FILE)) {
  chatHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
}

let onlineUsers = new Set();

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  let currentUser = null;
  ws.send(JSON.stringify({ type: 'history', data: chatHistory }));
  ws.send(JSON.stringify({ type: 'online', data: Array.from(onlineUsers) }));

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message);
      if (msg.type === 'join' && msg.sender) {
        currentUser = msg.sender;
        onlineUsers.add(currentUser);
        broadcast({ type: 'online', data: Array.from(onlineUsers) });
      } else if (msg.type === 'typing' && currentUser) {
        broadcast({ type: 'typing', data: { sender: currentUser, typing: msg.typing } }, ws);
      } else if (msg.sender && msg.text) {
        msg.time = new Date().toLocaleTimeString();
        chatHistory.push(msg);
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(chatHistory, null, 2));
        broadcast({ type: 'message', data: msg });
      }
    } catch (e) {
      // Ignore malformed messages
    }
  });

  ws.on('close', () => {
    if (currentUser) {
      onlineUsers.delete(currentUser);
      broadcast({ type: 'online', data: Array.from(onlineUsers) });
    }
  });
});

function broadcast(msg, exceptWs) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN && client !== exceptWs) {
      client.send(JSON.stringify(msg));
    }
  });
}

console.log(`WebSocket server running on ws://localhost:${PORT}`); 