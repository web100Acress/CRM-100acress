const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/userModel');

async function createTestUser() {
  try {
    // Connect to MongoDB - using the same connection as the app
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/100acres');
    console.log('Connected to MongoDB');

    // Create test admin user
    const testUser = {
      name: 'Test Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      department: 'admin',
      status: 'active',
      createdAt: new Date(),
      lastLogin: null
    };

    // Check if user exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    if (existingUser) {
      console.log('User already exists, updating...');
      await User.updateOne({ email: 'admin@example.com' }, testUser);
    } else {
      const user = new User(testUser);
      await user.save();
      console.log('Test user created successfully');
    }

    console.log('Test user credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Role: admin');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser();
