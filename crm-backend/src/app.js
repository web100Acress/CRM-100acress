const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ✅ Step 1: Secure & flexible CORS config
const allowedOrigins = [
  'http://localhost:5000',           // Local dev
  'http://localhost:5173',           // Vite dev
  'http://localhost:3000',           // React dev
  'http://localhost:5001',
  'http://localhost:5001',       // Production frontend
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

module.exports = app;
