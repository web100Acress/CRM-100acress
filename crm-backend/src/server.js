require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const app = require('./app'); // app.js should export: const express = require('express')();
const connectDB = require('./config/db'); // MongoDB connection function
const { port } = require('./config/config'); // contains: exports.port = process.env.PORT || 5001;
const meetingController = require('./controllers/meetingController');

// ✅ Step 1: Connect to MongoDB
connectDB();

// ✅ Step 4: Set up HTTP server
const server = http.createServer(app);

// ✅ Step 5: Setup Socket.IO with CORS
// Use the same allowedOrigins as in app.js
const allowedOrigins = [
  'https://crm.100acress.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5000',
  'https://api.100acress.com'
];
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
app.use('/api/auth', require('./routes/auth')); // 👈 this is required for login
app.use('/api/users', require('./routes/userRoutes')); // Optional: if you have users route

// ✅ Step 8: Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
});
