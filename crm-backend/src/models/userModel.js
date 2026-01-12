const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // You may want to auto-generate or handle this
    role: { type: String, enum: ['admin', 'user', 'superadmin', 'super-admin', 'boss', 'hod', 'team-leader', 'bd', 'developer', 'hr_finance', 'it_infrastructure', 'sales_head', 'sales_executive', 'hr_manager', 'hr_executive', 'blog_manager', 'blog_writer', 'crm_admin'], default: 'user' },
    phone: String,
    department: String,
    reportingTo: String,
    permissions: [String],
    allowedModules: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    profileImage: { type: String, default: null },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

module.exports = mongoose.model('User', userSchema);