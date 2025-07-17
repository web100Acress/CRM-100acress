const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ✅ Step 1: Secure & flexible CORS config
const allowedOrigins = [
  'http://localhost:5001',           // Local dev
  'http://localhost:5173',           // Vite dev
  'http://localhost:3000',           // React dev
  'http://localhost:5000',           // Add this for your frontend
  'https://crm.100acress.com',
  'https://crm.100acress.com',       // Production frontend
  'https://api.100acress.com'        // (if used)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS denied for origin:', origin);
      callback(null, false); // Never throw!
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Explicitly handle OPTIONS preflight requests for all routes
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS denied for origin:', origin);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Step 2: Parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Step 3: API routes mounted at /api
app.use('/api', routes);

// ✅ Step 4: Error handler middleware (must be after routes)
app.use(errorHandler);

app.get('/test-cors', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

module.exports = app;
