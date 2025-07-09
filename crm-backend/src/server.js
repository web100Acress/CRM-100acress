require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/config');
const http = require('http');
const socketio = require('socket.io');
const meetingController = require('./controllers/meetingController');

connectDB();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
meetingController.setSocketIO(io);

app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 