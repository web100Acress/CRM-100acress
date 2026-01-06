const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');
const auth = require('../middlewares/auth');

// Send a message
router.post('/send', auth, async (req, res) => {
  try {
    const { recipientId, recipientEmail, recipientName, message } = req.body;
    const senderId = req.user._id || req.user.userId;
    
    console.log('Message request:', {
      senderId,
      recipientId,
      recipientEmail,
      recipientName,
      message: message?.substring(0, 50) + '...'
    });

    // Validate required fields
    if (!senderId) {
      console.error('Sender ID is missing from req.user:', req.user);
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: User ID not found'
      });
    }

    if (!recipientId || !message || !recipientName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: recipientId, recipientName, and message are required'
      });
    }

    // Create new message
    const newMessage = new Message({
      senderId,
      recipientId,
      recipientEmail,
      recipientName,
      message,
      timestamp: new Date(),
      status: 'sent',
      direction: 'outgoing'
    });

    console.log('Creating message:', {
      _id: newMessage._id,
      senderId: newMessage.senderId,
      recipientId: newMessage.recipientId
    });

    await newMessage.save();

    // Update message status to delivered
    newMessage.status = 'delivered';
    await newMessage.save();

    console.log('Message saved successfully:', {
      id: newMessage._id,
      status: newMessage.status
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: newMessage._id,
        message: newMessage.message,
        timestamp: newMessage.timestamp,
        status: newMessage.status,
        recipient: {
          id: recipientId,
          name: recipientName,
          email: recipientEmail
        }
      }
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Get conversation between two users
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.userId;
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, recipientId: otherUserId },
        { senderId: otherUserId, recipientId: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation',
      error: error.message
    });
  }
});

// Get all conversations for current user
router.get('/conversations', auth, async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.userId;

    // Get unique conversations with last message
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: currentUserId },
            { recipientId: currentUserId }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$senderId', currentUserId] },
              then: '$recipientId',
              else: '$senderId'
            }
          },
          lastMessage: { $first: '$$ROOT' },
          recipientName: { $first: '$recipientName' },
          recipientEmail: { $first: '$recipientEmail' },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ['$recipientId', currentUserId] },
                    { $eq: ['$status', 'delivered'] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: conversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
});

// Mark messages as read
router.put('/read/:conversationId', auth, async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.userId;
    const conversationId = req.params.conversationId;

    await Message.updateMany(
      {
        recipientId: currentUserId,
        senderId: conversationId,
        read: false
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    });
  }
});

module.exports = router;
