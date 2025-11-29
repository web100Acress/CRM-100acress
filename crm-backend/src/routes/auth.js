  const express = require('express');
  const router = express.Router();
  const User = require('../models/userModel');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const userController = require('../controllers/userController');

  // LOGIN route
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      console.log('Login attempt:', { email, password });
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found for email:', email);
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('User found:', user.email, user.role);
      
      // Check if user is active
      if (user.status === 'inactive') {
        console.log('User account is inactive:', email);
        return res.status(403).json({ message: 'Account is deactivated. Please contact administrator.' });
      }
      
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      if (!isMatch) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Update last login
      await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      console.log('Login successful for:', email);
      res.status(200).json({ 
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/request-password-reset', userController.requestPasswordReset);
  router.post('/reset-password', userController.resetPassword);

  module.exports = router;
