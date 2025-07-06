require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/config');

connectDB();

app.use('/api/leads', require('./routes/leadRoutes'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 