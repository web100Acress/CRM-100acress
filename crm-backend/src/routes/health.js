const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Get package.json path using absolute path
    const pkgPath = path.join(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // Check database connection
    const mongoose = require('mongoose');
    const dbState = mongoose.connection.readyState;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: pkg.version || '1.0.0',
      database: {
        status: dbState === 1 ? 'connected' : 'disconnected',
        state: dbState
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100
      }
    };

    // If database is not connected, mark as unhealthy
    if (dbState !== 1) {
      healthStatus.status = 'unhealthy';
      return res.status(503).json(healthStatus);
    }

    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;
