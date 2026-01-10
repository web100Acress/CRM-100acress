const mongoose = require('mongoose');
const Message = require('./src/models/message.model');

require('dotenv').config();

async function checkMessages() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crm-100acress');
    
    console.log('🔍 Checking WhatsApp Messages in Database...');
    console.log('='.repeat(50));
    
    const allMessages = await Message.find({});
    console.log('📊 Total messages:', allMessages.length);
    
    if (allMessages.length > 0) {
      console.log('\n📋 Recent messages:');
      allMessages.slice(-5).forEach((msg, index) => {
        console.log(`${index + 1}. ${msg.senderId} -> ${msg.recipientId}: "${msg.message}"`);
      });
      
      // Check for different sender/recipient pairs
      const pairs = new Set();
      allMessages.forEach(msg => {
        pairs.add(`${msg.senderId} -> ${msg.recipientId}`);
      });
      
      console.log(`\n🔗 Unique message pairs: ${pairs.size}`);
      Array.from(pairs).forEach(pair => console.log(`  - ${pair}`));
      
      // Check message structure
      console.log('\n📝 Message structure sample:');
      if (allMessages.length > 0) {
        const sample = allMessages[0];
        console.log('  - senderId:', sample.senderId);
        console.log('  - recipientId:', sample.recipientId);
        console.log('  - message:', sample.message);
        console.log('  - timestamp:', sample.timestamp);
        console.log('  - status:', sample.status);
      }
    } else {
      console.log('❌ No messages found in database');
      console.log('\n💡 This means:');
      console.log('  1. No messages have been sent yet');
      console.log('  2. Messages are not being saved to database');
      console.log('  3. Database connection issue');
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Database check complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkMessages();
