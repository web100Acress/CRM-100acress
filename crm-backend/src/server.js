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
// If you have Ticket, Team, Approval, Task, FollowUp models, import them as needed:
// const Ticket = require('./models/ticketModel');
// const Team = require('./models/teamModel');
// const Approval = require('./models/approvalModel');
// const Task = require('./models/taskModel');
// const FollowUp = require('./models/followUpModel');

// ✅ Step 1: Connect to MongoDB
connectDB();

// ✅ Step 4: Set up HTTP server
const server = http.createServer(app);

// ✅ Step 5: Setup Socket.IO with CORS
// Use the same allowedOrigins as in app.js
const allowedOrigins = [
  'http://localhost:5001',
  'http://localhost:5000',           // Local dev
  'http://localhost:5173',           // Vite dev
  'http://localhost:3000',           // React dev
  'http://localhost:5001',       // Production frontend
  'https://api.100acress.com',
  'http://localhost:5001',
  'https://100acress.com'         // (if used)
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

  socket.on('requestRoleDashboardStats', async ({ role, userId }) => {
    console.log('[Socket.IO] Received requestRoleDashboardStats:', { role, userId });
    let stats = {};
    if (role === 'super-admin') {
      stats = {
        totalLeads: await Lead.countDocuments(),
        activeUsers: await User.countDocuments({ status: 'active' }),
        openTickets: 75, // Replace with: await Ticket.countDocuments({ status: 'open' })
        monthlyRevenue: 125000000, // Example static value
      };
    } else if (role === 'head-admin') {
      stats = {
        managedLeads: await Lead.countDocuments({ managedBy: userId }),
        totalTeams: 8, // Replace with: await Team.countDocuments({ headAdmin: userId })
        pendingApprovals: 15, // Replace with: await Approval.countDocuments({ status: 'pending', approver: userId })
        overallConversion: 8.5, // Example static or calculated value
      };
    } else if (role === 'team-leader') {
      stats = {
        myTeamLeads: await Lead.countDocuments({ teamLeader: userId }),
        teamSize: 12, // Replace with: await User.countDocuments({ teamLeader: userId })
        myPendingTasks: 7, // Replace with: await Task.countDocuments({ assignedTo: userId, status: 'pending' })
        teamTargetAchieved: 8000000, // Example static value
      };
    } else if (role === 'employee') {
      stats = {
        assignedLeads: await Lead.countDocuments({ assignedTo: userId }),
        todaysFollowups: 12, // Replace with: await FollowUp.countDocuments({ user: userId, date: new Date().toISOString().slice(0,10) })
        myOpenTickets: 3, // Replace with: await Ticket.countDocuments({ assignedTo: userId, status: 'open' })
        monthlyTargetProgress: 75, // Example static value
      };
    }
    console.log('[Socket.IO] Emitting roleDashboardStats:', stats);
    socket.emit('roleDashboardStats', stats);
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
