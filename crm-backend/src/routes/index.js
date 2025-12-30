const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/leads', require('./leadRoutes'));
router.use('/auth', require('./auth'));
router.use('/dashboard', require('./dashboardRoutes'));
router.use('/activity', require('./activityRoutes'));
router.use('/calls', require('./callRoutes'));
router.use('/comm-admin', require('./commAdminRoutes'));

module.exports = router;