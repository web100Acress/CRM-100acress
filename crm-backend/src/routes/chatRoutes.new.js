const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middlewares/auth');

// Create or get chat between assigner and assignee
router.post('/create', auth, chatController.createOrGetChat);

// Send message in a chat
router.post('/send-message', auth, chatController.sendMessage);

// Get messages for a chat
router.get('/messages', auth, chatController.getChatMessages);

// Get all chats for current user
router.get('/user-chats', auth, chatController.getUserChats);

module.exports = router;
