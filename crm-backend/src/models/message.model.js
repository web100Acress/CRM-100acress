const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderRole: {
    type: String,
    enum: ['boss', 'hod', 'team-leader', 'bd'],
    default: 'bd'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientRole: {
    type: String,
    enum: ['boss', 'hod', 'team-leader', 'bd'],
    default: 'bd'
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

const normalizeRole = (role) => {
  const r = String(role || '').trim();
  const key = r.toLowerCase();
  if (key === 'boss' || key === 'super-admin') return 'boss';
  if (key === 'hod' || key === 'head-admin' || key === 'head' || key === 'head_admin') return 'hod';
  if (key === 'team-leader' || key === 'team_leader') return 'team-leader';
  if (key === 'bd' || key === 'employee' || key === 'bd ') return 'bd';
  if (r === 'BD') return 'bd';
  return key;
};

messageSchema.pre('validate', function (next) {
  if (this.senderRole) this.senderRole = normalizeRole(this.senderRole);
  if (this.recipientRole) this.recipientRole = normalizeRole(this.recipientRole);
  next();
});

// Indexes for better performance
messageSchema.index({ senderId: 1, recipientId: 1, timestamp: -1 });
messageSchema.index({ recipientId: 1, read: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
