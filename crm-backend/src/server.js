require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/config');
const meetingController = require('./controllers/meetingController');

// ✅ Step 1: Connect to MongoDB
connectDB();

// ✅ Step 2: Set up allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || 'http://13.233.167.95',
  'https://13.233.167.95:5001',
  'http://localhost:3000',
  'https://crm.100acress.com'
];

// ✅ Step 3: Apply CORS middleware to Express
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy does not allow access from this origin.'));
    }
  },
  credentials: true
}));

// ✅ Step 4: Set up HTTP server
const server = http.createServer(app);

// ✅ Step 5: Setup Socket.IO with CORS
const io = socketio(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Socket.IO CORS origin not allowed: ' + origin));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});


// ✅ Step 6: Initialize socket controller
meetingController.setSocketIO(io);

// ✅ Step 7: API routes
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));

// ✅ Step 8: Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
});
