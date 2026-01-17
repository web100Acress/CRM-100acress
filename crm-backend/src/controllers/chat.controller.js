const { getUserChats, createChat, getChatMessages, sendMessage } = require('../services/chatService');

// Get user chats
const getUserChatsController = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const result = await getUserChats(userId);
    res.json(result);
  } catch (error) {
    console.error('Error in getUserChatsController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats',
      error: error.message
    });
  }
};

// Create new chat
const createChatController = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Add current user ID to chat data
    const chatData = {
      ...req.body,
      currentUserId: userId
    };

    const result = await createChat(chatData);
    res.json(result);
  } catch (error) {
    console.error('Error in createChatController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat',
      error: error.message
    });
  }
};

// Get chat messages
const getChatMessagesController = async (req, res) => {
  try {
    const { chatId } = req.query;
    
    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID is required'
      });
    }

    const result = await getChatMessages(chatId);
    res.json(result);
  } catch (error) {
    console.error('Error in getChatMessagesController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Send message
const sendMessageController = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.userId || req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const messageData = {
      ...req.body,
      senderId: userId,
      senderName: req.user?.name || 'Unknown User'
    };

    const result = await sendMessage(chatId, messageData);
    res.json(result);
  } catch (error) {
    console.error('Error in sendMessageController:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

module.exports = {
  getUserChatsController,
  createChatController,
  getChatMessagesController,
  sendMessageController
};
