const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/', auth, userController.getUsers);
router.post('/', userController.createUser);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.put('/:id/status', auth, userController.updateUserStatus);
router.delete('/:id', auth, userController.deleteUser);

// Proxy endpoint for 100acress API
router.get('/external/100acress-users', auth, async (req, res) => {
  try {
    const axios = require('axios');
    const SERVICE_TOKEN = process.env.SERVICE_TOKEN;
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3500';
    
    if (!SERVICE_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        message: 'Service token not configured in CRM backend' 
      });
    }
    
    // Forward the request to 100acress backend with service token
    const response = await axios.get(`${BACKEND_URL}/postPerson/view/allusers`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Proxy error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({ 
        success: false, 
        message: `100acress API error: ${error.response.data?.message || error.response.statusText}` 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to connect to 100acress backend' 
      });
    }
  }
});

// Proxy endpoint for 100acress download API
router.get('/external/100acress-users/download', auth, async (req, res) => {
  try {
    const axios = require('axios');
    const SERVICE_TOKEN = process.env.SERVICE_TOKEN;
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3500';
    
    if (!SERVICE_TOKEN) {
      return res.status(500).json({ 
        success: false, 
        message: 'Service token not configured in CRM backend' 
      });
    }
    
    // Forward the download request to 100acress backend
    const response = await axios.get(`${BACKEND_URL}/userViewAll/dowloadData`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      responseType: 'stream'
    });
    
    // Forward the download headers and stream
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Disposition', response.headers['content-disposition']);
    res.setHeader('Content-Length', response.headers['content-length']);
    
    response.data.pipe(res);
  } catch (error) {
    console.error('Download proxy error:', error.message);
    if (error.response) {
      res.status(error.response.status).json({ 
        success: false, 
        message: `100acress API error: ${error.response.data?.message || error.response.statusText}` 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to connect to 100acress backend' 
      });
    }
  }
});

module.exports = router;