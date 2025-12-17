const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://100acress.com',
  'https://www.100acress.com',  // ✅ added
  'https://api.100acress.com',
  'http://localhost:5001',
  'http://localhost:3500',
  'https://crm.100acress.com',
  'https://bcrm.100acress.com'
  
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.warn('CORS denied for origin:', origin);
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // 10 minutes
  optionsSuccessStatus: 204
};

// Apply CORS
app.use(cors(corsOptions));

// Preflight
app.options('*', cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Root route redirect to login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Error handler
app.use(errorHandler);

// Debug route
app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

module.exports = app;
