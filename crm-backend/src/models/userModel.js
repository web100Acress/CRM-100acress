const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // You may want to auto-generate or handle this
    role: { type: String, enum: ['admin', 'user', 'superadmin', 'head-admin', 'team-leader', 'employee'], default: 'user' },
    phone: String,
    department: String,
    reportingTo: String,
    permissions: [String],
    createdAt: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('User', userSchema); 