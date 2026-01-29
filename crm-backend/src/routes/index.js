const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/leads', require('./leadRoutes'));
router.use('/auth', require('./auth'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/activity', require('./activityRoutes'));
router.use('/calls', require('./callRoutes'));
router.use('/comm-admin', require('./commAdminRoutes'));
router.use('/webhooks', require('./callWebhookRoutes'));
router.use('/whatsapp', require('./whatsappRoutes'));
router.use('/email', require('./emailRoutes'));
router.use('/chats', require('./chatRoutes'));
router.use('/lead-assignment', require('./leadAssignmentRoutes'));
router.use('/api-tester', require('./apiTester.routes'));
router.use('/website-enquiries', require('./websiteEnquiryRoutes'));
router.use('/direct-db', require('./directDB'));

module.exports = router;