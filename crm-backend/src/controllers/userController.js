const userService = require('../services/userService');
const { sendMail } = require('../services/emailService');

async function sendWelcomeEmail({ email, password, name, role }) {
  const roleDisplayMap = {
    'employee': 'Business Development (BD)',
    'head-admin': 'HOD',
    'super-admin': 'BOSS',
    'team-leader': 'Team Leader',
    'developer': 'Developer'
  };
  const roleDisplay = roleDisplayMap[role] || role;
  const subject = `Welcome to 100acress CRM - Your ${roleDisplay} Account`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to 100acress CRM</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f4f7f6;
          color: #333;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .email-header {
          background: rgba(255,255,255,0.1);
          padding: 30px;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .email-header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .email-header .subtitle {
          color: rgba(255,255,255,0.9);
          margin: 10px 0 0 0;
          font-size: 16px;
        }
        .email-body {
          background: white;
          padding: 40px 30px;
        }
        .welcome-section {
          text-align: center;
          margin-bottom: 30px;
        }
        .welcome-section h2 {
          color: #2d3748;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .welcome-section p {
          color: #718096;
          font-size: 16px;
          line-height: 1.6;
        }
        .credentials-card {
          background: linear-gradient(135deg, #f6f9fc 0%, #e9ecef 100%);
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .credentials-title {
          color: #2d3748;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .credential-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        .credential-item:last-child {
          border-bottom: none;
        }
        .credential-label {
          font-weight: 600;
          color: #4a5568;
          font-size: 14px;
        }
        .credential-value {
          font-weight: 500;
          color: #2d3748;
          font-size: 14px;
          background: white;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        .security-section {
          background: #fff5f5;
          border: 2px solid #fed7d7;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
        }
        .security-title {
          color: #c53030;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .security-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .security-list li {
          padding: 8px 0;
          color: #742a2a;
          font-size: 14px;
          line-height: 1.5;
          position: relative;
          padding-left: 25px;
        }
        .security-list li:before {
          content: "⚠️";
          position: absolute;
          left: 0;
          top: 8px;
        }
        .responsibilities-section {
          background: #f0fff4;
          border: 2px solid #9ae6b4;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
        }
        .responsibilities-title {
          color: #22543d;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .responsibilities-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .responsibilities-list li {
          padding: 8px 0;
          color: #2f855a;
          font-size: 14px;
          line-height: 1.5;
          position: relative;
          padding-left: 25px;
        }
        .responsibilities-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          top: 8px;
          color: #22543d;
          font-weight: bold;
        }
        .footer {
          background: #f7fafc;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          color: #718096;
          font-size: 14px;
          margin: 5px 0;
        }
        .company-name {
          font-weight: 600;
          color: #2d3748;
        }
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
            border-radius: 12px;
          }
          .email-header, .email-body, .footer {
            padding: 20px;
          }
          .credential-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .credential-value {
            align-self: stretch;
            text-align: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>🏢 Welcome to 100acress CRM</h1>
          <p class="subtitle">Your ${roleDisplay} Account is Ready!</p>
        </div>
        
        <div class="email-body">
          <div class="welcome-section">
            <h2>Hello ${name || 'Team Member'}! 👋</h2>
            <p>Welcome to 100acress CRM! Your ${roleDisplay} account has been successfully created and is ready for you to start managing your responsibilities.</p>
          </div>
          
          <div class="credentials-card">
            <div class="credentials-title">🔐 Your Account Credentials</div>
            <div class="credential-item">
              <span class="credential-label">Your Role:</span>
              <span class="credential-value">${roleDisplay}</span>
            </div>
            <div class="credential-item">
              <span class="credential-label">Email Address:</span>
              <span class="credential-value">${email}</span>
            </div>
            <div class="credential-item">
              <span class="credential-label">Password:</span>
              <span class="credential-value">${password}</span>
            </div>
          </div>
          
          <div class="security-section">
            <div class="security-title">🚨 Important Security Warning</div>
            <ul class="security-list">
              <li>DO NOT share your CRM login credentials with anyone</li>
              <li>DO NOT share sensitive information or data with unauthorized persons</li>
              ${role === 'employee' ? '<li>Your account is for Business Development purposes only</li>' : '<li>Your account access should be used for authorized purposes only</li>'}
              <li>Any unauthorized sharing of credentials or data will result in immediate account suspension</li>
            </ul>
          </div>
          
          <div class="responsibilities-section">
            <div class="responsibilities-title">📋 Your Responsibilities</div>
            <ul class="responsibilities-list">
              ${role === 'employee' ? 
                `<li>Manage your assigned leads professionally</li>
                 <li>Update lead status regularly</li>
                 <li>Maintain confidentiality of all customer information</li>
                 <li>Report any suspicious activity immediately</li>` :
                `<li>Perform your duties professionally and ethically</li>
                 <li>Maintain confidentiality of sensitive information</li>
                 <li>Follow company policies and procedures</li>
                 <li>Report any suspicious activity immediately</li>`
              }
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #4a5568; font-size: 16px;">
              <strong>🔑 Please log in and change your password after your first login for security reasons.</strong>
            </p>
          </div>
        </div>
        
        <div class="footer">
          <p>Best regards,</p>
          <p class="company-name">The 100acress CRM Team</p>
          <p style="font-size: 12px; color: #a0aec0;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `Hello ${name || ''},

Welcome to 100acress CRM! Your ${roleDisplay} account has been created.

🔐 IMPORTANT SECURITY INSTRUCTIONS 🔐

Your Role: ${roleDisplay}
Your login credentials:
Email: ${email}
Password: ${password}

⚠️  SECURITY WARNING:
- DO NOT share your CRM login credentials with anyone
- DO NOT share sensitive information or data with unauthorized persons
- ${role === 'employee' ? 'Your account is for Business Development purposes only' : 'Your account access should be used for authorized purposes only'}
- Any unauthorized sharing of credentials or data will result in immediate account suspension

📋 RESPONSIBILITIES:
${role === 'employee' ? 
`- Manage your assigned leads professionally
- Update lead status regularly
- Maintain confidentiality of all customer information
- Report any suspicious activity immediately` :
`- Perform your duties professionally and ethically
- Maintain confidentiality of sensitive information
- Follow company policies and procedures
- Report any suspicious activity immediately`
}

Please log in and change your password after your first login.

Best regards,
The 100acress CRM Team`;
  
  await sendMail(email, subject, text, html);
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
        role: user.role,
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
        <p>Best regards,<br>100acress CRM Team</p>
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