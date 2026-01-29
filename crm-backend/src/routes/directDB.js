const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router();

// Debug route
router.get('/test', (req, res) => {
  res.json({ message: 'Direct DB route is working!' });
});

// Direct Database Connection Endpoint
router.post('/direct-db', async (req, res) => {
  try {
    const { dbConfig, query } = req.body;

    // Validate input
    if (!dbConfig || !query) {
      return res.status(400).json({
        success: false,
        message: 'Database config and query are required'
      });
    }

    // Create database connection
    const connection = await mysql.createConnection({
      host: dbConfig.servername,
      user: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      connectTimeout: 10000,
      acquireTimeout: 10000
    });

    console.log('✅ Direct DB: Connected to database');

    // Execute query
    const [rows] = await connection.execute(query);
    
    // Close connection
    await connection.end();
    
    console.log(`✅ Direct DB: Query executed successfully, ${rows.length} rows returned`);

    res.json({
      success: true,
      data: rows,
      message: `Successfully fetched ${rows.length} records`
    });

  } catch (error) {
    console.error('❌ Direct DB: Error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;
