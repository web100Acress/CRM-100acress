const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const {
  saveApiRequest,
  getApiRequests,
  deleteApiRequest,
  getDatabaseStatus
} = require('../controllers/apiTester.controller');

// Save API request to database
router.post('/save', authMiddleware, saveApiRequest);

// Get all API requests for a user
router.get('/requests', authMiddleware, getApiRequests);

// Delete specific API request
router.delete('/requests/:id', authMiddleware, deleteApiRequest);

// Check database connection status
router.get('/status', authMiddleware, getDatabaseStatus);

module.exports = router;
