require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/config');
const meetingController = require('./controllers/meetingController');

// Step 1: Connect to MongoDB
connectDB();

// Step 2: Set up HTTP server
const server = http.createServer(app);

// Step 3: Setup CORS (Allow only specific frontend domain)
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || 'http://13.233.167.95',
  'http://13.233.167.95:5001',
  'http://localhost:3000'
];
const io = socketio(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Step 4: Setup socket controller
meetingController.setSocketIO(io);

// Step 5: Use routes
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));

// Step 6: Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
});