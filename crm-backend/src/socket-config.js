// Enhanced Socket.IO Configuration for Production
const { allowedOrigins } = require('./cors-config');

const socketConfig = {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
  serveClient: false,
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: false
};

module.exports = socketConfig;
