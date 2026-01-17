const Chat = require('../models/chat.model');
const User = require('../models/user.model');

// Get user chats
const getUserChats = async (userId) => {
  try {
    const chats = await Chat.find({
      'participants._id': userId,
      isActive: true
    })
    .populate('participants._id', 'name email role')
    .populate('lastMessage.senderId', 'name')
    .populate('leadId._id', 'name')
    .sort({ updatedAt: -1 });

    return {
      success: true,
      data: chats
    };
  } catch (error) {
    console.error('Error fetching user chats:', error);
    throw error;
  }
};

// Create new chat
const createChat = async (chatData) => {
  try {
    const { participantId, participantName, participantEmail, participantRole } = chatData;
    
    // Get current user from token (this should be passed from controller)
    const currentUserId = chatData.currentUserId;
    
    // Check if chat already exists between these users
    const existingChat = await Chat.findOne({
      'participants._id': { $all: [currentUserId, participantId] },
      isActive: true
    });

    if (existingChat) {
      return {
        success: true,
        message: 'Chat already exists',
        chat: existingChat
      };
    }

    // Get current user details
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      throw new Error('Current user not found');
    }

    // Create new chat
    const newChat = new Chat({
      participants: [
        {
          _id: currentUserId,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role
        },
        {
          _id: participantId,
          name: participantName,
          email: participantEmail,
          role: participantRole
        }
      ],
      lastMessage: {
        message: 'Chat created',
        senderId: currentUserId,
        senderName: currentUser.name,
        timestamp: new Date()
      }
    });

    await newChat.save();

    // Populate participant details
    await newChat.populate('participants._id', 'name email role');

    return {
      success: true,
      message: 'Chat created successfully',
      chat: newChat
    };
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

// Get chat messages
const getChatMessages = async (chatId) => {
  try {
    const chat = await Chat.findById(chatId)
      .populate('messages.senderId', 'name email role')
      .select('messages');

    if (!chat) {
      throw new Error('Chat not found');
    }

    return {
      success: true,
      data: chat.messages
    };
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

// Send message
const sendMessage = async (chatId, messageData) => {
  try {
    const { message, senderId, senderName } = messageData;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    // Add new message
    const newMessage = {
      message,
      senderId,
      senderName,
      timestamp: new Date(),
      type: 'text'
    };

    chat.messages.push(newMessage);
    chat.lastMessage = {
      message,
      senderId,
      senderName,
      timestamp: new Date()
    };
    chat.updatedAt = new Date();

    await chat.save();

    return {
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

module.exports = {
  getUserChats,
  createChat,
  getChatMessages,
  sendMessage
};
