const express = require('express');
const {
  getUserChatsController,
  createChatController,
  getChatMessagesController,
  sendMessageController
} = require('../controllers/chat.controller');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Apply auth middleware to all routes
router.use(verifyToken);

// GET /api/chats/user-chats - Get user's chats
router.get('/user-chats', getUserChatsController);

// POST /api/chats/create - Create new chat
router.post('/create', createChatController);

// GET /api/chats/messages - Get chat messages
router.get('/messages', getChatMessagesController);

// POST /api/chats/:chatId/messages - Send message
router.post('/:chatId/messages', sendMessageController);

module.exports = router;
