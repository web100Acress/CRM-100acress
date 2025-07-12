const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({
  origin: 'https://13.233.167.95:5001',
  credentials: true
}));
app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

module.exports = app; 
