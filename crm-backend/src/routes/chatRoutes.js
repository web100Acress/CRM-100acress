const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/auth');

// Send a message
router.post('/send', auth, chatController.sendMessage);

// Get chat history for a lead
router.get('/', auth, chatController.getChatByLeadId);

// Get all conversations for current user
router.get('/conversations', auth, chatController.getConversations);

// Mark messages as read
router.patch('/read', auth, chatController.markAsRead);

module.exports = router;
