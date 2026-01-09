const mongoose = require('mongoose');
const Chat = require('./src/models/chatModel');
const ChatMessage = require('./src/models/messageModel');
const User = require('./src/models/userModel');
const Lead = require('./src/models/leadModel');

// Connect to MongoDB
mongoose.connect('mongodb+srv://officialhundredacress:officialhundredacress@cluster0.arz8gxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function testChatSystem() {
  try {
    console.log('\n🧪 Testing Chat System...\n');

    // Test 1: Create chat between Boss and BD
    console.log('📝 Test 1: Boss assigns lead to BD');
    const bossId = '6767c2f6715fbdf00174f4d8';
    const bdId = '6767c2f6715fbdf00174f4d9';
    const leadId = '6767c2f6715fbdf00174f4d8';

    // Check if chat already exists
    let chat = await Chat.findOne({
      leadId,
      participants: { $all: [bossId, bdId], $size: 2 }
    });

    if (!chat) {
      // Create new chat
      chat = new Chat({
        leadId,
        participants: [bossId, bdId],
        createdBy: bossId,
        assignedTo: bdId,
        lastMessage: {
          message: 'Lead assigned to BD',
          senderId: bossId,
          timestamp: new Date()
        }
      });
      await chat.save();
      console.log('✅ Chat created: Boss ↔ BD');
    } else {
      console.log('ℹ️ Chat already exists: Boss ↔ BD');
    }

    // Test 2: Send message
    console.log('\n📝 Test 2: Send message from Boss to BD');
    const message = new ChatMessage({
      chatId: chat._id,
      senderId: bossId,
      message: 'Hello BD, please follow up with this lead',
      status: 'sent'
    });
    await message.save();
    console.log('✅ Message sent from Boss to BD');

    // Test 3: Get messages
    console.log('\n📝 Test 3: Get chat messages');
    const messages = await ChatMessage.find({ chatId: chat._id })
      .populate('senderId', 'name')
      .sort({ timestamp: 1 });
    
    console.log(`✅ Found ${messages.length} messages:`);
    messages.forEach((msg, index) => {
      const senderName = msg.senderId ? msg.senderId.name : 'Unknown';
      console.log(`  ${index + 1}. ${senderName}: ${msg.message}`);
    });

    // Test 4: Get user's chats
    console.log('\n📝 Test 4: Get Boss\'s chats');
    const bossChats = await Chat.find({
      participants: bossId
    })
    .populate('participants', 'name role')
    .populate('leadId', 'name');

    console.log(`✅ Boss has ${bossChats.length} chats:`);
    bossChats.forEach((chat, index) => {
      const oppositeUser = chat.participants.find(u => u._id && u._id.toString() !== bossId);
      const leadName = chat.leadId ? chat.leadId.name : 'Unknown Lead';
      const oppositeUserName = oppositeUser ? oppositeUser.name : 'Unknown User';
      console.log(`  ${index + 1}. Chat with ${oppositeUserName} - Lead: ${leadName}`);
    });

    // Test 5: Test different user combinations
    console.log('\n📝 Test 5: Multiple user combinations');
    
    const combinations = [
      { assigner: 'Boss', assignee: 'HOD', assignerId: bossId, assigneeId: '6767c2f6715fbdf00174f4da' },
      { assigner: 'HOD', assignee: 'TL', assignerId: '6767c2f6715fbdf00174f4da', assigneeId: '6767c2f6715fbdf00174f4db' },
      { assigner: 'TL', assignee: 'BD', assignerId: '6767c2f6715fbdf00174f4db', assigneeId: bdId }
    ];

    for (const combo of combinations) {
      let existingChat = await Chat.findOne({
        leadId,
        participants: { $all: [combo.assignerId, combo.assigneeId], $size: 2 }
      });

      if (!existingChat) {
        const newChat = new Chat({
          leadId,
          participants: [combo.assignerId, combo.assigneeId],
          createdBy: combo.assignerId,
          assignedTo: combo.assigneeId,
          lastMessage: {
            message: `Lead assigned from ${combo.assigner} to ${combo.assignee}`,
            senderId: combo.assignerId,
            timestamp: new Date()
          }
        });
        await newChat.save();
        console.log(`✅ Chat created: ${combo.assigner} ↔ ${combo.assignee}`);
      } else {
        console.log(`ℹ️ Chat already exists: ${combo.assigner} ↔ ${combo.assignee}`);
      }
    }

    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run tests
testChatSystem();
