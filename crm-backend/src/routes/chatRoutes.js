const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const chatController = require('../controllers/chatController');

// 🎯 PERFECT CHAT ROUTES - Unified Implementation

// Apply authentication middleware to all routes
router.use(auth);

// 1. Chat Management Routes

// POST /api/chats/create-or-get - Create or get chat (Lead-based)
router.post('/create-or-get', chatController.createOrGetChat);

// POST /api/chats/create - Create chat (User-based - for user search)
router.post('/create', chatController.createChat);

// GET /api/chats/user-chats - Get all chats for current user
router.get('/user-chats', chatController.getUserChats);

// GET /api/chats/list - Alternative endpoint for user chats
router.get('/list', chatController.getUserChats);

// 2. Message Management Routes

// GET /api/chats/messages - Get messages for a specific chat
router.get('/messages', chatController.getChatMessages);

// POST /api/chats/send - Send message in a chat
router.post('/send', chatController.sendMessage);

// POST /api/chats/read - Mark messages as read
router.post('/read', chatController.markAsRead);

// 3. Chat Utility Routes

// POST /api/chats/mute - Toggle mute chat
router.post('/mute', chatController.toggleMuteChat);

// POST /api/chats/block - Block user
router.post('/block', chatController.blockUser);

// POST /api/chats/report - Report user
router.post('/report', chatController.reportUser);

// DELETE /api/chats/:chatId - Delete chat
router.delete('/:chatId', chatController.deleteChat);

module.exports = router;
