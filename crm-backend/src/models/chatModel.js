const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    enum: ['boss', 'hod', 'team-leader', 'bd', 'lead'],
    default: 'bd'
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverRole: {
    type: String,
    enum: ['boss', 'hod', 'team-leader', 'bd', 'lead'],
    default: 'bd'
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  direction: {
    type: String,
    enum: ['incoming', 'outgoing'],
    default: 'outgoing'
  },
  read: {
    type: Boolean,
    default: false
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'audio'],
    default: 'text'
  },
  attachmentUrl: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Indexes for better performance
chatSchema.index({ leadId: 1, timestamp: 1 });
chatSchema.index({ senderId: 1, receiverId: 1, timestamp: -1 });
chatSchema.index({ receiverId: 1, read: 1, timestamp: -1 });

module.exports = mongoose.model('Chat', chatSchema);
