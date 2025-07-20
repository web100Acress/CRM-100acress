const userService = require('../services/userService');
const nodemailer = require('nodemailer');

// Configure nodemailer (use your real SMTP credentials in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtpout.secureserver.net',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === 'true', // Use SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendWelcomeEmail({ email, password, name }) {
  const mailOptions = {
    from: process.env.SMTP_USER || 'your-email@gmail.com',
    to: email,
    subject: 'Welcome to 100acres CRM!',
    text: `Hello ${name || ''},\n\nWelcome to 100acres CRM!\n\nYour login details:\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password after your first login.\n\nRegards,\nThe 100acres CRM Team`,
  };
  await transporter.sendMail(mailOptions);
}

let io = null;
exports.setSocketIO = (ioInstance) => { io = ioInstance; };

exports.createUser = async (req, res, next) => {
  try {
    // Allow anyone to create any user role (removed special role restriction)
    const plainPassword = req.body.password; // Save the plain password BEFORE hashing
    const user = await userService.createUser(req.body);
    if (user && req.body.email) {
      await sendWelcomeEmail({
        email: user.email,
        password: plainPassword || '[Password not set]',
        name: user.name,
      });
    }
    res.status(201).json({ success: true, data: user });
    // Real-time emit for users and dashboard
    if (io) {
      const User = require('../models/userModel');
      const Lead = require('../models/leadModel');
      const allUsers = await User.find();
      io.emit('userUpdate', allUsers);
      // Dashboard stats emit
      const totalUsers = await User.countDocuments();
      const activeLeads = await Lead.countDocuments({ status: { $ne: 'Closed' } });
      const leads = await Lead.find();
      const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});
      io.emit('dashboardUpdate', { totalUsers, activeLeads, leadsByStatus });
    }
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ success: false, message: 'Email already exists. Please use a different email.' });
    }
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
    // Real-time emit for users and dashboard
    if (io) {
      const User = require('../models/userModel');
      const Lead = require('../models/leadModel');
      const allUsers = await User.find();
      io.emit('userUpdate', allUsers);
      // Dashboard stats emit
      const totalUsers = await User.countDocuments();
      const activeLeads = await Lead.countDocuments({ status: { $ne: 'Closed' } });
      const leads = await Lead.find();
      const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});
      io.emit('dashboardUpdate', { totalUsers, activeLeads, leadsByStatus });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
    // Real-time emit for users and dashboard
    if (io) {
      const User = require('../models/userModel');
      const Lead = require('../models/leadModel');
      const allUsers = await User.find();
      io.emit('userUpdate', allUsers);
      // Dashboard stats emit
      const totalUsers = await User.countDocuments();
      const activeLeads = await Lead.countDocuments({ status: { $ne: 'Closed' } });
      const leads = await Lead.find();
      const leadsByStatus = leads.reduce((acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      }, {});
      io.emit('dashboardUpdate', { totalUsers, activeLeads, leadsByStatus });
    }
  } catch (err) {
    next(err);
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const { user, token } = await userService.setResetToken(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password/${token}`;
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    });
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await userService.resetPassword(token, newPassword);
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password' });
  }
}; 