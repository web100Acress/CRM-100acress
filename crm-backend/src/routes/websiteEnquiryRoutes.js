const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

// 100acress.com API base URL - Production requires explicit BACKEND_URL
if (!process.env.BACKEND_URL) {
  throw new Error('BACKEND_URL is not defined in environment variables');
}
const WEBSITE_API_BASE = process.env.BACKEND_URL;

// Production detection
const isProduction = process.env.NODE_ENV === 'production' || !WEBSITE_API_BASE.includes('localhost');

/**
 * @route GET /api/website-enquiries
 * @desc Proxy route to fetch enquiries from 100acress.com (Boss/Admin only)
 * @access Private (Boss and Admin roles)
 */
router.get('/', auth, async (req, res) => {
  try {
    // Check if user has admin privileges (Boss, Admin, Super-Admin)
    const userRole = req.user?.role?.toLowerCase();
    const allowedRoles = ['boss', 'admin', 'super-admin', 'head-admin'];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This feature is for Admin roles only (Boss, Admin, Super-Admin, Head-Admin).'
      });
    }

    console.log(`🔍 Website Enquiries: User ${req.user.email} (${userRole}) requesting data`);
    console.log(`🔧 Environment Check:`, {
      hasServiceToken: !!process.env.SERVICE_TOKEN,
      serviceTokenLength: process.env.SERVICE_TOKEN?.length || 0,
      backendUrl: WEBSITE_API_BASE,
      isProduction,
      userRole
    });

    // 🔥 PRODUCTION: SERVICE_TOKEN is REQUIRED (no fallback)
    const serviceToken = process.env.SERVICE_TOKEN;
    const authMethod = 'service-token';

    if (!process.env.SERVICE_TOKEN) {
      return res.status(500).json({
        success: false,
        message: 'SERVICE_TOKEN missing in production. Contact administrator.',
        debug: {
          hasServiceToken: false,
          backendUrl: WEBSITE_API_BASE,
          isProduction
        }
      });
    }

    // Get limit from query params (default to 10000)
    const limit = req.query.limit || 10000;
    
    // Prepare request headers - only service-token for 100acress API
    const headers = {
      'Content-Type': 'application/json',
      'x-access-token': process.env.SERVICE_TOKEN
    };

    console.log(`🌐 Fetching from: ${WEBSITE_API_BASE}/crm/enquiries?limit=${limit}`);
    console.log(`🔐 Auth method: ${authMethod}`);
    
    // Fetch enquiries from 100acress backend
    const response = await fetch(`${WEBSITE_API_BASE}/crm/enquiries?limit=${limit}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error fetching enquiries from 100acress:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        authMethod,
        apiBase: WEBSITE_API_BASE
      });
      
      // Provide helpful error messages based on status
      let errorMessage = 'Failed to fetch enquiries from 100acress.com';
      if (response.status === 401) {
        errorMessage = 'Authentication failed. Please check SERVICE_TOKEN or admin credentials.';
      } else if (response.status === 403) {
        errorMessage = 'Access denied. User does not have sufficient privileges in 100acress.';
      } else if (response.status === 404) {
        errorMessage = '100acress API endpoint not found. Check BACKEND_URL configuration.';
      }
      
      return res.status(response.status).json({
        success: false,
        message: errorMessage,
        error: errorText,
        debug: {
          authMethod,
          apiBase: WEBSITE_API_BASE,
          hasServiceToken: !!process.env.SERVICE_TOKEN,
          isProduction
        }
      });
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.data?.length || 0} enquiries from 100acress`);
    
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
      total: transformedEnquiries.length,
      meta: {
        source: '100acress.com',
        authMethod,
        apiBase: WEBSITE_API_BASE,
        fetchedAt: new Date().toISOString(),
        userRole,
        isProduction
      }
    });

  } catch (error) {
    console.error('❌ Error in website-enquiries route:', error);
    console.error('❌ Full error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port
    });
    
    // Check if it's a network/connectivity error
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(500).json({
        success: false,
        message: `Cannot connect to 100acress backend at ${WEBSITE_API_BASE}. Please check if the service is running.`,
        error: error.message,
        debug: {
          apiBase: WEBSITE_API_BASE,
          errorCode: error.code,
          isNetworkError: true
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
      debug: {
        apiBase: WEBSITE_API_BASE,
        hasServiceToken: !!process.env.SERVICE_TOKEN,
        isProduction
      }
    });
  }
});

/**
 * @route GET /api/website-enquiries/debug
 * @desc Debug endpoint to test SERVICE_TOKEN and backend connectivity
 * @access Private (Admin only)
 */
router.get('/debug', auth, async (req, res) => {
  try {
    const userRole = req.user?.role?.toLowerCase();
    const allowedRoles = ['boss', 'admin', 'super-admin', 'head-admin'];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const debug = {
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasServiceToken: !!process.env.SERVICE_TOKEN,
        serviceTokenLength: process.env.SERVICE_TOKEN?.length || 0,
        serviceTokenPreview: process.env.SERVICE_TOKEN ? `${process.env.SERVICE_TOKEN.substring(0, 20)}...` : null,
        backendUrl: WEBSITE_API_BASE,
        isProduction: process.env.NODE_ENV === 'production' || !WEBSITE_API_BASE.includes('localhost')
      },
      user: {
        email: req.user.email,
        role: userRole,
        userId: req.user._id
      },
      authentication: {
        hasUserToken: !!req.headers.authorization,
        userTokenLength: req.headers.authorization?.length || 0
      }
    };

    // Test backend connectivity
    let backendTest = null;
    try {
      const testResponse = await fetch(`${WEBSITE_API_BASE}/health`, {
        method: 'GET',
        timeout: 5000
      });
      backendTest = {
        status: testResponse.status,
        ok: testResponse.ok,
        statusText: testResponse.statusText
      };
    } catch (testError) {
      backendTest = {
        error: testError.message,
        code: testError.code
      };
    }

    debug.backendTest = backendTest;

    res.json({
      success: true,
      message: 'Debug information retrieved successfully',
      debug
    });

  } catch (error) {
    console.error('❌ Error in debug endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Debug endpoint error',
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
