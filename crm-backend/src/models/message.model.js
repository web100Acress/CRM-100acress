const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    enum: ['admin', 'boss', 'hod', 'team-leader', 'sales_head', 'bd', 'crm_admin', 'manager', 'BD'],
    default: 'BD'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientRole: {
    type: String,
    enum: ['admin', 'boss', 'hod', 'team-leader', 'sales_head', 'bd', 'crm_admin', 'manager', 'BD'],
    default: 'BD'
  },
  recipientEmail: {
    type: String,
    required: true
  },
  recipientName: {
    type: String,
    required: true
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
}, {
  timestamps: true
});

// Indexes for better performance
messageSchema.index({ senderId: 1, recipientId: 1, timestamp: -1 });
messageSchema.index({ recipientId: 1, read: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
