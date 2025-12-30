require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

console.log('ENV CHECK MONGO_URI at startup:', process.env.MONGO_URI || '[UNDEFINED]');

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
  'https://api.100acress.com',
  'http://localhost:5001',
  'http://localhost:3500',
  'https://crm.100acress.com',
  'https://bcrm.100acress.com'
];

// ✅ Apply CORS globally for Express
// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Setup Socket.IO with same CORS rules
const io = socketio(server, {
  cors: {
    origin: allowedOrigins,
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
app.use('/api/health', require('./routes/health'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/calls', require('./routes/callRoutes'));
app.use('/api/comm-admin', require('./routes/commAdminRoutes'));
app.use('/api/webhooks', require('./routes/callWebhookRoutes'));
app.use('/api/whatsapp', require('./routes/whatsappRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));

// ✅ Temporary route to seed last login data
app.post('/api/admin/seed-last-login', async (req, res) => {
  try {
    console.log('Seeding last login data...');
    
    // Update all users who don't have lastLogin
    const result = await User.updateMany(
      { lastLogin: { $exists: false } },
      { 
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      }
    );
    
    // Update users who don't have status
    await User.updateMany(
      { status: { $exists: false } },
      { status: 'active' }
    );
    
    console.log(`Updated ${result.modifiedCount} users with last login`);
    
    // Update specific user
    const specificResult = await User.updateOne(
      { email: 'devfoliomarketplace@gmail.com' },
      { lastLogin: new Date() }
    );
    
    console.log(`Updated specific user: ${specificResult.modifiedCount} documents`);
    
    // Get sample users
    const users = await User.find({}).limit(5);
    const userList = users.map(user => ({
      email: user.email,
      lastLogin: user.lastLogin,
      status: user.status
    }));
    
    res.json({ 
      success: true, 
      message: 'Last login data seeded successfully',
      updatedCount: result.modifiedCount,
      users: userList
    });
    
  } catch (error) {
    console.error('Error seeding last login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error seeding last login data',
      error: error.message 
    });
  }
});

// ✅ Start Server (single HTTP server used for both Express and Socket.IO)
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
});
