const express = require('express');
const router = express.Router();

router.use('/users', require('./userRoutes'));
router.use('/leads', require('./leadRoutes'));

module.exports = router; 