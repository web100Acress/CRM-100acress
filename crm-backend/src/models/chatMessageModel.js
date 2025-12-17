const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    }
  },
  type: {
    type: String,
    enum: ['Custom', 'IT', 'Sales', 'Developer', 'HR', 'Marketing', 'Finance', 'Operations'],
    default: 'Custom'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  images: [{
    name: String,
    url: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
chatMessageSchema.index({ 'sender.department': 1 });
chatMessageSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
