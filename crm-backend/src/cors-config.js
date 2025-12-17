// CORS Configuration for Production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://100acress.com',
  'https://www.100acress.com',
  'https://api.100acress.com',
  'https://bcrm.100acress.com',  // Production domain for chat
  'http://localhost:5001',
  'http://localhost:3500'
];

module.exports = { allowedOrigins };
