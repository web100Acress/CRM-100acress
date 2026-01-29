// Add this to your server.js or create a temporary route
const express = require('express');
const router = express.Router();
const User = require('./src/models/userModel');

// Temporary route to seed last login data
router.post('/seed-last-login', async (req, res) => {
  try {
    console.log('Seeding last login data...');
    
    // Update all users who don't have lastLogin
    const result = await User.updateMany(
      { lastLogin: { $exists: false } },
      { 
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        status: { $ifNull: ['$status', 'active'] }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} users with last login`);
    
    // Update specific user
    const specificResult = await User.updateOne(
      { email: 'devfoliomarketplace@gmail.com' },
      { lastLogin: new Date() }
    );
    
    console.log(`Updated specific user: ${specificResult.modifiedCount} documents`);
    
    // Get sample users
    const users = await User.find({}).limit(5);
    const userList = users.map(user => ({
      email: user.email,
      lastLogin: user.lastLogin,
      status: user.status
    }));
    
    res.json({ 
      success: true, 
      message: 'Last login data seeded successfully',
      updatedCount: result.modifiedCount,
      users: userList
    });
    
  } catch (error) {
    console.error('Error seeding last login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error seeding last login data',
      error: error.message 
    });
  }
});

// Add this to your main server.js file:
// app.use('/api/admin', router);

module.exports = router;
