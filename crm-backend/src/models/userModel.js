const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // You may want to auto-generate or handle this
    role: { type: String, enum: ['admin', 'user', 'superadmin', 'super-admin', 'head-admin', 'team-leader', 'employee', 'developer', 'hr_finance', 'it_infrastructure', 'sales_head', 'sales_executive', 'hr_manager', 'hr_executive', 'blog_manager', 'blog_writer'], default: 'user' },
    phone: String,
    department: String,
    reportingTo: String,
    permissions: [String],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  });

module.exports = mongoose.model('User', userSchema); 