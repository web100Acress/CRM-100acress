const mongoose = require('mongoose');

const callRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userPhone: {
    type: String
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  leadName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number,
    required: true // in seconds
  },
  callDate: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['outbound', 'inbound'],
    default: 'outbound'
  },
  status: {
    type: String,
    enum: ['completed', 'missed', 'ongoing'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Index for better performance
callRecordSchema.index({ userId: 1, callDate: -1 });
callRecordSchema.index({ leadId: 1, callDate: -1 });

module.exports = mongoose.model('CallRecord', callRecordSchema);
