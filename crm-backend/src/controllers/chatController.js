const Chat = require('../models/chatModel');
const User = require('../models/userModel');

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
