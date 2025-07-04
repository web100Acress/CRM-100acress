const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String, // You can change to `ObjectId` with ref if you want to link User model
    required: true
  },
  role: {
    type: String,
    enum: ['super-admin', 'head-admin', 'team-leader', 'employee'],
    required: true
  },
  timestamp: {
    type: String, // Or `Date` with default: Date.now if preferred
    required: true
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  status: {
    type: String,
    enum: ['Cold', 'Warm', 'Hot'], // <-- match your frontend exactly
    default: 'Cold'
  },
  location: String,
  property: String,
  budget: String,
  assignedTo: String,
  assignedBy: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },

  followUps: [followUpSchema]
});

module.exports = mongoose.model('Lead', leadSchema); 