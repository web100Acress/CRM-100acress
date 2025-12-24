  const express = require('express');
  const router = express.Router();
  const User = require('../models/userModel');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const userController = require('../controllers/userController');
  const { verifyAcressUserAccess } = require('../utils/verify100acressUser');
  const { mapAcressRoleToCRM } = require('../services/roleMappingService');

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
        process.env.JWT_SECRET || 'aman123',
        { expiresIn: '7d' } // Changed from '1d' to '7d'
      );

      console.log('Login successful for:', email);
      res.status(200).json({ 
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          allowedModules: user.allowedModules || [],
          permissions: user.permissions || [],
          status: user.status,
          lastLogin: user.lastLogin
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Verify 100acress token and grant CRM access
  router.post('/verify-100acress-token', async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required',
        });
      }

      // Verify 100acress token and get user data
      const result = await verifyAcressUserAccess(token);

      if (!result.success) {
        return res.status(401).json({
          success: false,
          message: result.error || 'Invalid or expired token',
        });
      }

      const acressUser = result.user;
      const mappedRole = acressUser.mappedRole || mapAcressRoleToCRM(acressUser.role);

      // Generate CRM token for the user
      const crmToken = jwt.sign(
        {
          userId: acressUser._id,
          role: mappedRole,
          email: acressUser.email,
          sourceSystem: '100acress',
          originalRole: acressUser.role,
        },
        process.env.JWT_SECRET || 'aman123',
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        token: crmToken,
        user: {
          _id: acressUser._id,
          email: acressUser.email,
          name: acressUser.name,
          role: mappedRole,
          originalRole: acressUser.role,
          sourceSystem: '100acress',
        },
      });
    } catch (error) {
      console.error('Error verifying 100acress token:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error while verifying token',
      });
    }
  });

  router.post('/request-password-reset', userController.requestPasswordReset);
  router.post('/reset-password', userController.resetPassword);

  module.exports = router;
