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
    enum: ['boss', 'hod', 'team-leader', 'bd'],
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

const assignmentChainSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  role: { type: String, required: true },
  name: { type: String, required: true },
  assignedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['assigned', 'forwarded', 'completed', 'rejected'],
    default: 'assigned'
  },
  completedAt: { type: Date },
  notes: { type: String },
  assignedBy: {
    _id: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String },
    role: { type: String }
  },
  // Add chat creation trigger
  chatCreated: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  status: {
    type: String,
    enum: ['Cold', 'Warm', 'Hot'], // <-- match your frontend exactly
    default: 'Cold'
  },
  location: String,
  projectName: String, // <-- Added Project Name field
  property: String,
  budget: String,
  assignedTo: String,
  assignedBy: String,
  workProgress: {
    type: String,
    enum: ['pending', 'inprogress', 'done'],
    default: 'pending'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  assignmentChain: [assignmentChainSchema],
  followUps: [followUpSchema]
});

module.exports = mongoose.model('Lead', leadSchema); 