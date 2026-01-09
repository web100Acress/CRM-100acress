const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const chatController = require('../controllers/chatController');

router.get('/messages', auth, chatController.getChatMessages);
router.post('/send', auth, chatController.sendMessage);
router.get('/user-chats', auth, chatController.getUserChats);
router.post('/create', auth, chatController.createOrGetChat);
router.post('/read', auth, chatController.markAsRead);

module.exports = router;
