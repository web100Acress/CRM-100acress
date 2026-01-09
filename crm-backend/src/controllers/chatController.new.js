const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Lead = require('../models/leadModel');

// Create or get chat between assigner and assignee
exports.createOrGetChat = async (req, res, next) => {
  try {
    const { leadId, createdBy, assignedTo } = req.body;
    
    if (!leadId || !createdBy || !assignedTo) {
      return res.status(400).json({ 
        success: false, 
        message: 'leadId, createdBy, and assignedTo are required' 
      });
    }

    // Rule: Sirf assigner aur assignee ke beech chat
    if (createdBy === assignedTo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot create chat with same user' 
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      leadId,
      participants: { $all: [createdBy, assignedTo] }
    }).populate('participants', 'name');

    // If not exists, create new chat
    if (!chat) {
      chat = new Chat({
        leadId,
        participants: [createdBy, assignedTo],
        createdBy,
        assignedTo
      });
      await chat.save();
      
      // Populate participants
      await chat.populate('participants', 'name');
    }

    res.status(200).json({ 
      success: true, 
      data: chat 
    });

  } catch (err) {
    next(err);
  }
};

// Send message in a chat
exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId, message, senderId } = req.body;

    if (!chatId || !message || !senderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'chatId, message, and senderId are required' 
      });
    }

    // Security: Check if user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(senderId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: Not a participant' 
      });
    }

    // Create message
    const newMessage = new Message({
      chatId,
      senderId,
      message,
      status: 'sent'
    });

    await newMessage.save();

    // Update chat's last message
    chat.lastMessage = {
      message,
      senderId,
      timestamp: new Date()
    };
    await chat.save();

    // Populate and return
    await newMessage.populate('senderId', 'name');

    res.status(201).json({ 
      success: true, 
      data: newMessage 
    });

  } catch (err) {
    next(err);
  }
};

// Get messages for a chat
exports.getChatMessages = async (req, res, next) => {
  try {
    const { chatId } = req.query;
    const currentUserId = req.user?.userId || req.user?._id;

    if (!chatId) {
      return res.status(400).json({ 
        success: false, 
        message: 'chatId is required' 
      });
    }

    // Security: Check if user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(currentUserId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: Not a participant' 
      });
    }

    // Get messages
    const messages = await Message.find({ chatId })
      .populate('senderId', 'name')
      .sort({ timestamp: 1 });

    res.status(200).json({ 
      success: true, 
      data: messages 
    });

  } catch (err) {
    next(err);
  }
};

// Get all chats for current user
exports.getUserChats = async (req, res, next) => {
  try {
    const currentUserId = req.user?.userId || req.user?._id;
    
    if (!currentUserId) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }

    // Get all chats where user is participant
    const chats = await Chat.find({
      participants: currentUserId
    })
    .populate('participants', 'name')
    .populate('leadId', 'name')
    .sort({ updatedAt: -1 });

    res.status(200).json({ 
      success: true, 
      data: chats 
    });

  } catch (err) {
    next(err);
  }
};
