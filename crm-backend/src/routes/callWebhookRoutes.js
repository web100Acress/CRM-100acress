const express = require('express');
const router = express.Router();

const webhookController = require('../controllers/callWebhookController');

// Twilio webhooks are x-www-form-urlencoded
router.post('/twilio/voice', express.urlencoded({ extended: false }), webhookController.twilioVoiceWebhook);
router.post('/twilio/status', express.urlencoded({ extended: false }), webhookController.twilioStatusWebhook);

module.exports = router;
