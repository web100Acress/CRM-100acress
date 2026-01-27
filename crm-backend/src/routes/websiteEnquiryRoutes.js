const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// 100acress.com API base URL
const WEBSITE_API_BASE = process.env.BACKEND_URL || 'http://localhost:3500';

/**
 * @route GET /api/website-enquiries
 * @desc Proxy route to fetch enquiries from 100acress.com (Boss only)
 * @access Private (Boss only)
 */
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is Boss
    const userRole = req.user?.role?.toLowerCase();
    if (userRole !== 'boss' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This feature is for Boss role only.'
      });
    }

    // Get service token for 100acress backend authentication
    const serviceToken = process.env.SERVICE_TOKEN;
    if (!serviceToken) {
      return res.status(500).json({
        success: false,
        message: 'Service token not configured. Please contact administrator.'
      });
    }

    // Get limit from query params (default to 10000)
    const limit = req.query.limit || 10000;
    
    // Fetch enquiries from 100acress backend
    const response = await fetch(`${WEBSITE_API_BASE}/crm/enquiries?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': serviceToken
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching enquiries from 100acress:', errorText);
      return res.status(response.status).json({
        success: false,
        message: 'Failed to fetch enquiries from 100acress.com',
        error: errorText
      });
    }

    const data = await response.json();
    
    // Transform the data to match CRM lead structure
    const transformedEnquiries = (data.data || data.users || data || []).map(enquiry => ({
      _id: enquiry._id,
      name: enquiry.name || enquiry.firstName + ' ' + enquiry.lastName || 'Unknown',
      email: enquiry.email || '',
      phone: enquiry.mobile || enquiry.phone || '',
      projectName: enquiry.projectName || enquiry.interestedProject || 'Not specified',
      budget: enquiry.budget || '',
      message: enquiry.message || enquiry.requirement || '',
      status: enquiry.status || 'new',
      source: '100acress.com',
      createdAt: enquiry.createdAt || enquiry.created_at || new Date(),
      updatedAt: enquiry.updatedAt || enquiry.updated_at || new Date(),
      // Additional fields for CRM compatibility
      assignedTo: null,
      assignedToName: 'Unassigned',
      priority: enquiry.priority || 'medium',
      followUpDate: null,
      lastContactDate: enquiry.createdAt || new Date(),
      notes: enquiry.message || enquiry.requirement || '',
      // Keep original enquiry data for reference
      originalEnquiry: enquiry
    }));

    res.json({
      success: true,
      message: 'Enquiries fetched successfully',
      data: transformedEnquiries,
      total: transformedEnquiries.length
    });

  } catch (error) {
    console.error('Error in website-enquiries route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * @route GET /api/website-enquiries/download
 * @desc Download enquiries as Excel from 100acress.com (Boss only)
 * @access Private (Boss only)
 */
router.get('/download', auth, async (req, res) => {
  try {
    // Check if user is Boss
    const userRole = req.user?.role?.toLowerCase();
    if (userRole !== 'boss' && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This feature is for Boss role only.'
      });
    }

    // Get service token for 100acress backend authentication
    const serviceToken = process.env.SERVICE_TOKEN;
    if (!serviceToken) {
      return res.status(500).json({
        success: false,
        message: 'Service token not configured. Please contact administrator.'
      });
    }

    // Fetch Excel file from 100acress backend
    const response = await fetch(`${WEBSITE_API_BASE}/crm/enquiries/download`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': serviceToken
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error downloading enquiries from 100acress:', errorText);
      return res.status(response.status).json({
        success: false,
        message: 'Failed to download enquiries from 100acress.com',
        error: errorText
      });
    }

    // Set appropriate headers for file download
    const contentDisposition = response.headers.get('content-disposition');
    const contentType = response.headers.get('content-type') || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    
    res.setHeader('Content-Type', contentType);
    if (contentDisposition) {
      res.setHeader('Content-Disposition', contentDisposition);
    } else {
      res.setHeader('Content-Disposition', 'attachment; filename="100acress-enquiries.xlsx"');
    }

    // Pipe the response stream to the client
    response.body.pipe(res);

  } catch (error) {
    console.error('Error in website-enquiries download route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
