const userService = require('../services/userService');
const { sendMail } = require('../services/emailService');

async function sendWelcomeEmail({ email, password, name }) {
  const subject = 'Welcome to 100acres CRM!';
  const text = `Hello ${name || ''},

Welcome to 100acres CRM!

Your login details:
Email: ${email}
Password: ${password}

Please log in and change your password after your first login.

Regards,
The 100acres CRM Team`;
  
  await sendMail(email, subject, text, null);
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

exports.updateUserModules = async (req, res, next) => {
  try {
    const { allowedModules } = req.body || {};

    if (!Array.isArray(allowedModules)) {
      return res.status(400).json({ success: false, message: 'allowedModules must be an array' });
    }

    const user = await userService.updateUser(req.params.id, { allowedModules });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({ success: true, data: user });
  } catch (err) {
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

exports.getMe = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user });
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
  console.log('Password reset request for email:', email);
  
  try {
    const { user, token } = await userService.setResetToken(email);
    if (!user) {
      console.log('User not found for password reset:', email);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Reset token generated for user:', email);
    
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
    console.log('Reset URL:', resetUrl);
    
    const mailOptions = {
      from: process.env.EMAIL_USER || process.env.SMTP_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px;">
        <h2 style="color: #e11d48;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <p style="margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>100acres CRM Team</p>
      </div>
      `
    };
    
    await sendMail(email, 'Password Reset Request', `Please use this link to reset your password: ${resetUrl}`, mailOptions.html);
    console.log('Password reset email sent successfully to:', email);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Error in password reset:', err);
    res.status(500).json({ message: 'Error sending reset email: ' + err.message });
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

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Must be "active" or "inactive"' 
      });
    }
    
    const user = await userService.updateUserStatus(id, status);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: `User status updated to ${status}`,
      data: user 
    });
  } catch (err) {
    console.error('Error updating user status:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating user status' 
    });
  }
}; 