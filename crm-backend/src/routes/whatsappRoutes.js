const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const whatsappController = require('../controllers/whatsappController');

router.get('/messages', auth, whatsappController.listMessages);
router.post('/send', auth, whatsappController.sendMessage);

module.exports = router;
