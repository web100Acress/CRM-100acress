const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// File-based token storage for persistence
const TOKENS_FILE = path.join(__dirname, '../data/uploadTokens.json');

// Helper functions for token storage
const loadTokens = () => {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      const data = fs.readFileSync(TOKENS_FILE, 'utf8');
      return new Map(JSON.parse(data));
    }
  } catch (error) {
    console.log('No existing tokens file, starting fresh');
  }
  return new Map();
};

const saveTokens = (tokens) => {
  try {
    const data = JSON.stringify(Array.from(tokens.entries()));
    const dir = path.dirname(TOKENS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TOKENS_FILE, data);
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

// Load existing tokens
let uploadTokens = loadTokens();

// Generate upload link token
router.post('/internal/generate-link/:onboardingId', (req, res) => {
  try {
    const { onboardingId } = req.params;
    const { expiresInHours = 48 } = req.body;
    
    console.log('=== TOKEN GENERATION DEBUG ===');
    console.log('Onboarding ID:', onboardingId);
    console.log('Expires in hours:', expiresInHours);
    
    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + (expiresInHours * 60 * 60 * 1000));
    
    console.log('Generated token:', token);
    console.log('Expires at:', expiresAt);
    
    // Store token with candidate info (mock data for now)
    const candidateInfo = {
      candidateName: 'Test Candidate',
      position: 'Software Developer',
      department: 'IT',
      onboardingId,
      expiresAt
    };
    
    uploadTokens.set(token, candidateInfo);
    saveTokens(uploadTokens);
    console.log('Token stored successfully');
    console.log('Total tokens in storage:', uploadTokens.size);
    
    res.json({
      success: true,
      data: {
        token,
        expiresAt: candidateInfo.expiresAt
      }
    });
  } catch (error) {
    console.error('Error generating upload link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate upload link'
    });
  }
});

// Verify upload token
router.get('/verify-upload-token/:token', (req, res) => {
  try {
    const { token } = req.params;
    
    console.log('=== TOKEN VERIFICATION DEBUG ===');
    console.log('Received token:', token);
    console.log('Available tokens:', Array.from(uploadTokens.keys()));
    console.log('Token exists in storage:', uploadTokens.has(token));
    
    if (!uploadTokens.has(token)) {
      console.log('Token not found in storage');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    const candidateInfo = uploadTokens.get(token);
    console.log('Candidate info:', candidateInfo);
    
    // Check if token is expired
    if (new Date() > new Date(candidateInfo.expiresAt)) {
      console.log('Token expired');
      uploadTokens.delete(token);
      saveTokens(uploadTokens);
      return res.status(400).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    console.log('Token verification successful');
    res.json({
      success: true,
      data: candidateInfo
    });
  } catch (error) {
    console.error('Error verifying upload token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify token'
    });
  }
});

// Upload documents
router.post('/upload-documents/:token', upload.any(), (req, res) => {
  try {
    const { token } = req.params;
    
    console.log('=== DOCUMENT UPLOAD DEBUG ===');
    console.log('Received token:', token);
    console.log('Available tokens:', Array.from(uploadTokens.keys()));
    console.log('Token exists in storage:', uploadTokens.has(token));
    
    if (!uploadTokens.has(token)) {
      console.log('Token not found in storage');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    const candidateInfo = uploadTokens.get(token);
    
    // Check if token is expired
    if (new Date() > new Date(candidateInfo.expiresAt)) {
      uploadTokens.delete(token);
      return res.status(400).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    // Handle file upload (mock implementation)
    // In production, you would handle actual file uploads here
    console.log('Documents uploaded for candidate:', candidateInfo.candidateName);
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);
    console.log('Number of files:', req.files?.length || 0);
    
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        console.log(`File ${index + 1}:`, file.originalname, file.size, 'bytes');
      });
    }
    
    // Clean up token after successful upload
    uploadTokens.delete(token);
    saveTokens(uploadTokens);
    
    res.json({
      success: true,
      message: 'Documents uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload documents'
    });
  }
});

// Send documentation invite
router.post('/:id/docs-invite', (req, res) => {
  try {
    const { id } = req.params;
    const { uploadLink, content } = req.body;
    
    console.log('Sending docs invite for onboarding ID:', id);
    console.log('Upload link:', uploadLink);
    console.log('Content:', content);
    
    // Mock email sending
    // In production, you would send actual email here
    
    res.json({
      success: true,
      message: 'Documentation invite sent successfully'
    });
  } catch (error) {
    console.error('Error sending docs invite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send documentation invite'
    });
  }
});

// Test endpoint to verify token generation
router.get('/test-token', (req, res) => {
  try {
    const testOnboardingId = 'test-123';
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + (48 * 60 * 60 * 1000));
    
    const candidateInfo = {
      candidateName: 'Test Candidate',
      position: 'Software Developer',
      department: 'IT',
      onboardingId: testOnboardingId,
      expiresAt
    };
    
    uploadTokens.set(token, candidateInfo);
    saveTokens(uploadTokens);
    
    const uploadLink = `https://crm.100acress.com/upload-documents/${token}`;
    
    res.json({
      success: true,
      message: 'Test token generated successfully',
      data: {
        token,
        uploadLink,
        expiresAt
      }
    });
  } catch (error) {
    console.error('Error generating test token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate test token'
    });
  }
});

module.exports = router;
