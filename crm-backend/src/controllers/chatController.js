const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Lead = require('../models/leadModel');

// 🎯 WhatsApp Style Chat System
exports.createOrGetChat = async (req, res, next) => {
  try {
    const { leadId, createdBy, assignedTo } = req.body;
    
    if (!leadId || !createdBy || !assignedTo) {
      return res.status(400).json({ 
        success: false, 
        message: 'leadId, createdBy, and assignedTo are required' 
      });
    }

    // 🚫 Self assignment check
    if (createdBy === assignedTo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Self assignment not allowed' 
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      leadId,
      participants: { $all: [createdBy, assignedTo] }
    }).populate('participants', 'name role email')
      .populate('messages.senderId', 'name role email');

    if (!chat) {
      // Create new WhatsApp-style chat
      chat = new Chat({
        leadId,
        participants: [createdBy, assignedTo],
        lastMessage: {
          message: `Lead assigned`,
          senderId: createdBy,
          timestamp: new Date()
        }
      });
      await chat.save();
      
      // Populate participants and messages
      await chat.populate('participants', 'name role email');
      await chat.populate('messages.senderId', 'name role email');
    }

    res.status(200).json({ 
      success: true, 
      data: chat 
    });

  } catch (err) {
    next(err);
  }
};

// Send message in WhatsApp style
exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId, message, senderId, messageType = 'text', attachmentUrl = null } = req.body;

    if (!chatId || !message || !senderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'chatId, message, and senderId are required' 
      });
    }

    // Security: Check if user is participant
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.map(id => id.toString()).includes(senderId.toString())) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: Not a participant' 
      });
    }

    // Add message to chat
    const newMessage = {
      senderId,
      message: message.trim(),
      timestamp: new Date(),
      status: 'sent',
      messageType,
      attachmentUrl
    };

    chat.messages.push(newMessage);

    // Update last message
    chat.lastMessage = {
      message: message.trim(),
      senderId,
      timestamp: new Date()
    };

    // Update unread count for other participant
    const otherParticipant = chat.participants.find(id => id.toString() !== senderId);
    if (otherParticipant) {
      const currentCount = chat.unreadCount.get(otherParticipant.toString()) || 0;
      chat.unreadCount.set(otherParticipant.toString(), currentCount + 1);
    }

    await chat.save();

    // Populate and return
    await chat.populate('participants', 'name role email');
    await chat.populate('messages.senderId', 'name role email');

    res.status(201).json({ 
      success: true, 
      data: {
        chatId: chat._id,
        message: newMessage,
        senderName: chat.participants.find(p => p._id.toString() === senderId)?.name
      }
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
    if (!chat || !chat.participants.map(id => id.toString()).includes(currentUserId.toString())) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: Not a participant' 
      });
    }

    // Mark messages as read for current user
    chat.unreadCount.set(currentUserId, 0);
    await chat.save();

    // Get chat with populated messages
    const populatedChat = await Chat.findById(chatId)
      .populate('participants', 'name role email')
      .populate('messages.senderId', 'name role email');

    res.status(200).json({ 
      success: true, 
      data: populatedChat.messages || []
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
    .populate('participants', 'name role email')
    .populate('leadId', 'name email phone status')
    .sort({ updatedAt: -1 });

    // Format for frontend
    const formattedChats = chats.map(chat => {
      const oppositeUser = chat.participants.find(u => u._id.toString() !== currentUserId);
      const unreadCount = chat.unreadCount.get(currentUserId) || 0;
      
      return {
        _id: chat._id,
        leadId: chat.leadId,
        participants: chat.participants,
        oppositeUser: {
          _id: oppositeUser?._id,
          name: oppositeUser?.name,
          role: oppositeUser?.role,
          email: oppositeUser?.email
        },
        lastMessage: chat.lastMessage,
        unreadCount,
        updatedAt: chat.updatedAt
      };
    });

    res.status(200).json({ 
      success: true, 
      data: formattedChats 
    });

  } catch (err) {
    next(err);
  }
};

// Mark messages as read
exports.markAsRead = async (req, res, next) => {
  try {
    const { chatId } = req.body;
    const currentUserId = req.user?.userId || req.user?._id;

    if (!chatId) {
      return res.status(400).json({ 
        success: false, 
        message: 'chatId is required' 
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(currentUserId)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied: Not a participant' 
      });
    }

    // Mark as read
    chat.unreadCount.set(currentUserId, 0);
    await chat.save();

    res.status(200).json({ 
      success: true, 
      message: 'Messages marked as read' 
    });

  } catch (err) {
    next(err);
  }
};
