const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint to force clear user session
app.post('/api/force-clear-session', (req, res) => {
  const { email } = req.body;
  
  console.log('🧹 Force clear session request for:', email);
  
  if (email === 'web.100acress@gmail.com') {
    console.log('✅ Authorized session clear for boss user');
    
    res.json({
      success: true,
      message: 'Session cleared successfully',
      instructions: [
        '1. Browser localStorage will be cleared',
        '2. Page will reload automatically',
        '3. Login again with updated role',
        '4. HODs should be visible in assignment dropdown'
      ],
      action: 'localStorage.clear(); location.reload();'
    });
  } else {
    console.log('❌ Unauthorized email:', email);
    res.status(401).json({
      success: false,
      message: 'Unauthorized email'
    });
  }
});

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`🚀 Force clear server running on port ${PORT}`);
  console.log(`📝 Test with: curl -X POST http://localhost:${PORT}/api/force-clear-session -H "Content-Type: application/json" -d '{"email": "web.100acress@gmail.com"}'`);
});
