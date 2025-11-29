const mongoose = require('mongoose');
const User = require('./src/models/userModel');

async function updateLastLogin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/acre-flow-crm');
    console.log('Connected to MongoDB');
    
    // Update all users who don't have lastLogin with a sample date
    const result = await User.updateMany(
      { lastLogin: { $exists: false } },
      { lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) } // Random date within last 30 days
    );
    
    console.log('Updated users:', result.modifiedCount, 'documents');
    
    // Update specific user
    const specificResult = await User.updateOne(
      { email: 'devfoliomarketplace@gmail.com' },
      { lastLogin: new Date() }
    );
    
    console.log('Updated specific user:', specificResult.modifiedCount, 'documents');
    
    // Show some users with lastLogin
    const users = await User.find({ lastLogin: { $exists: true } }).limit(3);
    console.log('Sample users with lastLogin:');
    users.forEach(user => {
      console.log(`- ${user.email}: ${user.lastLogin}`);
    });
    
    mongoose.connection.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err);
  }
}

updateLastLogin();
