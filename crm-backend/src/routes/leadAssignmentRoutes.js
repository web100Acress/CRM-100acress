const express = require('express');
const router = express.Router();
const leadAssignmentController = require('../controllers/leadAssignmentController');
const auth = require('../middlewares/auth');

// Assign lead with auto chat creation
router.post('/assign', auth, leadAssignmentController.assignLead);

// Get chats for a specific lead
router.get('/chats', auth, leadAssignmentController.getChatsByLead);

// Get all chats for current user
router.get('/user-chats', auth, leadAssignmentController.getUserChats);

module.exports = router;
