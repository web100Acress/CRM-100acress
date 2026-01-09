const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const Lead = require('../models/leadModel');

// Send a message (BD ↔ Lead / HOD ↔ BD)
exports.sendMessage = async (req, res, next) => {
  try {
    const { leadId, message, senderId, senderRole, receiverId, receiverRole } = req.body;

    if (!leadId || !message || !senderId || !receiverId) {
      return res.status(400).json({ success: false, message: 'leadId, message, senderId, and receiverId are required' });
    }

    const chat = new Chat({
      leadId,
      message,
      senderId,
      senderRole,
      receiverId,
      receiverRole,
      direction: 'outgoing',
      status: 'sent'
    });

    await chat.save();

    // Optional: populate sender details for immediate response
    const populated = await Chat.findById(chat._id).populate('senderId', 'name').populate('receiverId', 'name');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// Get chat history for a specific lead
exports.getChatByLeadId = async (req, res, next) => {
  try {
    const { leadId } = req.query;

    if (!leadId) {
      return res.status(400).json({ success: false, message: 'leadId is required' });
    }

    const chats = await Chat.find({ leadId })
      .populate('senderId', 'name')
      .populate('receiverId', 'name')
      .sort({ timestamp: 1 });

    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    next(err);
  }
};

// Get all conversations for current user (grouped by lead)
exports.getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user?.userId || req.user?._id;
    
    if (!currentUserId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Find all chats where user is either sender or receiver
    const chats = await Chat.find({
      $or: [
        { senderId: currentUserId },
        { receiverId: currentUserId }
      ]
    })
    .populate('senderId', 'name')
    .populate('receiverId', 'name')
    .populate('leadId', 'name')
    .sort({ timestamp: -1 });

    // Group by leadId and get latest message for each lead
    const conversationsMap = new Map();
    
    chats.forEach(chat => {
      const leadId = chat.leadId._id.toString();
      const otherUser = chat.senderId._id.toString() === currentUserId ? chat.receiverId : chat.senderId;
      
      if (!conversationsMap.has(leadId) || conversationsMap.get(leadId).timestamp < chat.timestamp) {
        conversationsMap.set(leadId, {
          _id: otherUser._id,
          recipientName: otherUser.name,
          recipientEmail: otherUser.email || '',
          leadId: leadId,
          leadName: chat.leadId.name,
          lastMessage: {
            message: chat.message,
            timestamp: chat.timestamp
          },
          unreadCount: 0 // TODO: Calculate actual unread count
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());
    
    res.status(200).json({ success: true, data: conversations });
  } catch (err) {
    next(err);
  }
};

// Mark messages as read (for BDs)
exports.markAsRead = async (req, res, next) => {
  try {
    const { leadId, userId } = req.body;

    await Chat.updateMany(
      { leadId, receiverId: userId, read: false },
      { $set: { read: true, status: 'read' } }
    );

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (err) {
    next(err);
  }
};
