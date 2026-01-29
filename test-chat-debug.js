const mongoose = require('mongoose');
const Chat = require('./crm-backend/src/models/chatModel');
const Lead = require('./crm-backend/src/models/leadModel');
const User = require('./crm-backend/src/models/userModel');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/crm-100acress', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function debugChat() {
  try {
    console.log('🔍 Checking chat collection...');
    
    // 1. Check total chats
    const totalChats = await Chat.countDocuments();
    console.log(`Total chats in database: ${totalChats}`);
    
    // 2. Get all chats with messages
    const chats = await Chat.find({})
      .populate('participants', 'name role email')
      .populate('leadId', 'name')
      .populate('messages.senderId', 'name');
    
    console.log('\n📊 Chat Details:');
    chats.forEach((chat, index) => {
      console.log(`\nChat ${index + 1}:`);
      console.log(`  Lead: ${chat.leadId?.name || 'N/A'}`);
      console.log(`  Participants: ${chat.participants.map(p => `${p.name} (${p.role})`).join(', ')}`);
      console.log(`  Messages: ${chat.messages.length}`);
      console.log(`  Last Message: ${chat.lastMessage?.message || 'None'}`);
      console.log(`  Created: ${chat.createdAt}`);
      
      if (chat.messages.length > 0) {
        console.log(`  Message Preview:`);
        chat.messages.slice(0, 3).forEach((msg, i) => {
          console.log(`    ${i + 1}. ${msg.senderId?.name || 'Unknown'}: ${msg.message}`);
        });
      }
    });
    
    // 3. Check specific lead
    const leadId = '676a463c5c7f2a001e5c72c0'; // Example lead ID
    const leadChats = await Chat.find({ leadId })
      .populate('participants', 'name role')
      .populate('messages.senderId', 'name');
    
    console.log(`\n🎯 Chats for lead ${leadId}:`);
    leadChats.forEach((chat, index) => {
      console.log(`Chat ${index + 1}:`);
      console.log(`  Participants: ${chat.participants.map(p => p.name).join(', ')}`);
      console.log(`  Messages: ${chat.messages.length}`);
    });
    
    // 4. Check users
    const users = await User.find({}).select('name role email _id');
    console.log('\n👥 Users in database:');
    users.forEach(user => {
      console.log(`  ${user.name} (${user.role}) - ID: ${user._id}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugChat();
