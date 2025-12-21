const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Mock storage for upload tokens (in production, use Redis or database)
const uploadTokens = new Map();

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
router.post('/upload-documents/:token', (req, res) => {
  try {
    const { token } = req.params;
    
    if (!uploadTokens.has(token)) {
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
    
    // Clean up token after successful upload
    uploadTokens.delete(token);
    
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

module.exports = router;
