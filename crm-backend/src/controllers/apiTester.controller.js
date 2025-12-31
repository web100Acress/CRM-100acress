const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/auth.middleware');

// Schema for API Tester requests
const ApiTesterRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
  },
  url: {
    type: String,
    required: true
  },
  headers: [{
    key: String,
    value: String
  }],
  params: [{
    key: String,
    value: String
  }],
  body: String,
  contentType: {
    type: String,
    default: 'application/json'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  response: {
    status: Number,
    statusText: String,
    headers: mongoose.Schema.Types.Mixed,
    data: mongoose.Schema.Types.Mixed,
    time: String
  }
}, {
  timestamps: true
});

const ApiTesterRequest = mongoose.model('ApiTesterRequest', ApiTesterRequestSchema);

// Save API request to database
const saveApiRequest = async (req, res) => {
  try {
    const { method, url, headers, params, body, contentType, timestamp, response } = req.body;
    
    const apiRequest = new ApiTesterRequest({
      userId: req.user.userId || req.user.id || req.user._id,
      method,
      url,
      headers: headers || [],
      params: params || [],
      body: body || '',
      contentType: contentType || 'application/json',
      timestamp: timestamp || new Date(),
      response: response || null
    });

    await apiRequest.save();
    
    res.status(201).json({
      success: true,
      message: 'API request saved successfully',
      data: apiRequest
    });
  } catch (error) {
    console.error('Error saving API request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save API request',
      error: error.message
    });
  }
};

// Get all API requests for a user
const getApiRequests = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    
    const requests = await ApiTesterRequest.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 requests
    
    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching API requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch API requests',
      error: error.message
    });
  }
};

// Delete API request
const deleteApiRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id || req.user._id;
    
    const request = await ApiTesterRequest.findOneAndDelete({ _id: id, userId });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'API request not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'API request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting API request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete API request',
      error: error.message
    });
  }
};

// Check database connection status
const getDatabaseStatus = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const connected = dbState === 1; // 1 = connected
    
    res.status(200).json({
      success: true,
      connected: connected,
      state: dbState,
      message: connected ? 'Database connected' : 'Database disconnected'
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    res.status(500).json({
      success: false,
      connected: false,
      message: 'Failed to check database status',
      error: error.message
    });
  }
};

module.exports = {
  saveApiRequest,
  getApiRequests,
  deleteApiRequest,
  getDatabaseStatus,
  ApiTesterRequest
};
