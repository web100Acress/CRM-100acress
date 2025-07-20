require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const app = require('./app'); // app.js should export: const express = require('express')();
const connectDB = require('./config/db'); // MongoDB connection function
const { port } = require('./config/config'); // contains: exports.port = process.env.PORT || 5001;
const meetingController = require('./controllers/meetingController');
const User = require('./models/userModel');
const Lead = require('./models/leadModel');

// ✅ Step 1: Connect to MongoDB
connectDB();

// ✅ Step 4: Set up HTTP server
const server = http.createServer(app);

// ✅ Step 5: Setup Socket.IO with CORS
// Use the same allowedOrigins as in app.js
const allowedOrigins = [
  'https://crm.100acress.com',
  'http://localhost:5000',           // Local dev
  'http://localhost:5173',           // Vite dev
  'http://localhost:3000',           // React dev
  'https://crm.100acress.com',       // Production frontend
  'https://api.100acress.com',
  'https://crm.100acress.com'         // (if used)
];
const io = socketio(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('Socket.IO CORS denied for origin:', origin);
        callback(null, false); // Never throw!
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});


// ✅ Step 6: Initialize socket controller
meetingController.setSocketIO(io);

io.on('connection', (socket) => {
  socket.on('requestDashboardStats', async () => {
    // Emit all users
    const users = await User.find();
    socket.emit('userUpdate', users);

    // Emit all leads
    const leads = await Lead.find();
    socket.emit('leadUpdate', leads);

    // Emit dashboard stats
    const totalUsers = await User.countDocuments();
    const activeLeads = await Lead.countDocuments({ status: { $ne: 'Closed' } });
    const allLeads = await Lead.find();
    const leadsByStatus = allLeads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});
    socket.emit('dashboardUpdate', { totalUsers, activeLeads, leadsByStatus });
  });
});

// ✅ Step 7: API routes
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/auth', require('./routes/auth')); // 👈 this is required for login
app.use('/api/users', require('./routes/userRoutes')); // Optional: if you have users route

// ✅ Step 8: Start server
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
});
