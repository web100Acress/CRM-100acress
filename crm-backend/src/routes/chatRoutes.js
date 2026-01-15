const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const chatController = require('../controllers/chatController');

router.get('/list', auth, chatController.getUserChats); // Add missing /list endpoint
router.get('/messages', auth, chatController.getChatMessages);
router.post('/send', auth, chatController.sendMessage);
router.get('/user-chats', auth, chatController.getUserChats);
router.post('/create', auth, chatController.createOrGetChat);
router.post('/create-chat', auth, chatController.createChat); // New endpoint for user search
router.post('/read', auth, chatController.markAsRead);
router.post('/mute', auth, chatController.toggleMuteChat);
router.post('/block', auth, chatController.blockUser);
router.post('/report', auth, chatController.reportUser);
router.delete('/:chatId', auth, chatController.deleteChat);

module.exports = router;
