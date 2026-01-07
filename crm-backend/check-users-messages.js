const mongoose = require('mongoose');
const Message = require('./src/models/message.model');
const User = require('./src/models/userModel');

require('dotenv').config();

async function checkUsersAndMessages() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crm-100acress');
    
    console.log('🔍 Checking Users and Messages...');
    console.log('='.repeat(50));
    
    // Get all users
    const users = await User.find({});
    console.log('👥 Users in database:');
    users.forEach(user => {
      console.log(`  - ${user.name || user.email} (ID: ${user._id})`);
    });
    
    // Get recent messages with user details
    const messages = await Message.find({}).sort({ timestamp: -1 }).limit(10);
    console.log('\n📨 Recent messages with user details:');
    
    for (const msg of messages) {
      const sender = users.find(u => String(u._id) === String(msg.senderId));
      const recipient = users.find(u => String(u._id) === String(msg.recipientId));
      
      console.log(`\n📝 Message: "${msg.message}"`);
      console.log(`  From: ${sender?.name || sender?.email || 'Unknown'} (${msg.senderId})`);
      console.log(`  To: ${recipient?.name || recipient?.email || 'Unknown'} (${msg.recipientId})`);
      console.log(`  Time: ${new Date(msg.timestamp).toLocaleString()}`);
    }
    
    await mongoose.disconnect();
    console.log('\n✅ User and message check complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUsersAndMessages();
