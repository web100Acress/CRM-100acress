const mongoose = require('mongoose');

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

module.exports = ApiTesterRequest;
