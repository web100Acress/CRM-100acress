require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const app = require('./app'); // app.js = express instance
const connectDB = require('./config/db'); // MongoDB connection
const { port } = require('./config/config');
const meetingController = require('./controllers/meetingController');
const User = require('./models/userModel');
const Lead = require('./models/leadModel');

// ✅ Connect to MongoDB
connectDB();

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://100acress.com',
  'https://www.100acress.com',   // ✅ Added
  'https://api.100acress.com'
];

// ✅ Apply CORS globally for Express
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('❌ CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Preflight requests
app.options('*', cors());

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Setup Socket.IO with same CORS rules
const io = socketio(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('❌ Socket.IO CORS blocked:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ✅ Attach SocketIO controller
meetingController.setSocketIO(io);

io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('requestDashboardStats', async () => {
    const users = await User.find();
    const leads = await Lead.find();

    socket.emit('userUpdate', users);
    socket.emit('leadUpdate', leads);

    const totalUsers = await User.countDocuments();
    const activeLeads = await Lead.countDocuments({ status: { $ne: 'Closed' } });
    const leadsByStatus = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    socket.emit('dashboardUpdate', { totalUsers, activeLeads, leadsByStatus });
  });

  socket.on('requestRoleDashboardStats', async ({ role, userId }) => {
    console.log('[Socket.IO] requestRoleDashboardStats:', { role, userId });
    let stats = {};

    if (role === 'super-admin') {
      stats = {
        totalLeads: await Lead.countDocuments(),
        activeUsers: await User.countDocuments({ status: 'active' }),
        openTickets: 75,
        monthlyRevenue: 125000000
      };
    } else if (role === 'head-admin') {
      stats = {
        managedLeads: await Lead.countDocuments({ managedBy: userId }),
        totalTeams: 8,
        pendingApprovals: 15,
        overallConversion: 8.5
      };
    } else if (role === 'team-leader') {
      stats = {
        myTeamLeads: await Lead.countDocuments({ teamLeader: userId }),
        teamSize: 12,
        myPendingTasks: 7,
        teamTargetAchieved: 8000000
      };
    } else if (role === 'employee') {
      stats = {
        assignedLeads: await Lead.countDocuments({ assignedTo: userId }),
        todaysFollowups: 12,
        myOpenTickets: 3,
        monthlyTargetProgress: 75
      };
    }

    socket.emit('roleDashboardStats', stats);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ✅ API Routes
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes'));

// ✅ Start Server
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
});
