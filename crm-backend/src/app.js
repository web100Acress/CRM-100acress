const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ✅ Step 1: Secure & flexible CORS config
const allowedOrigins = [
  'http://localhost:5001',
  'http://localhost:3000', // optional: for local dev
  'http://localhost:5173', // Vite dev server (local dev)
  'http://localhost:5000', // Added for local dev on port 5000
  'https://api.100acress.com' // optional: if frontend uses subdomain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // Changed from throwing error to returning false
    }
  },
  credentials: true
}));

// ✅ Step 2: Parse incoming JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Step 3: API routes mounted at /api
app.use('/api', routes);

// ✅ Step 4: Error handler middleware (must be after routes)
app.use(errorHandler);

module.exports = app;
