const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true,
    index: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  messages: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'audio'],
      default: 'text'
    },
    attachmentUrl: {
      type: String,
      default: null
    }
  }],
  lastMessage: {
    message: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, { timestamps: true });

// Indexes for performance
chatSchema.index({ leadId: 1, participants: 1 });
chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });

// Validation: Exactly 2 participants
chatSchema.pre('save', function(next) {
  if (this.participants.length !== 2) {
    return next(new Error('Chat must have exactly 2 participants'));
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);
