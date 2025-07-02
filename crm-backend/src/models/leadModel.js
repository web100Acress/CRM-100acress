const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('Lead', leadSchema); 