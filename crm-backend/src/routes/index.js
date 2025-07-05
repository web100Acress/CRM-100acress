const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/leads', require('./leadRoutes'));
router.use('/auth', require('./auth'));

module.exports = router; 