const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getValidToken, getTokenStatus, forceRefreshToken } = require('../services/tokenRefreshService');

// 100acress.com API base URL
// - In production: BACKEND_URL must be explicitly set
// - In dev: fall back to the public API to avoid hard-crashing
const DEFAULT_WEBSITE_API_BASE = 'https://api.100acress.com';
const RAW_BACKEND_URL = process.env.BACKEND_URL;
// If someone sets BACKEND_URL to localhost (common in dev docs), prefer production API
// so CRM can fetch enquiries without requiring the local 100acress backend.
const WEBSITE_API_BASE =
  !RAW_BACKEND_URL || RAW_BACKEND_URL.includes('localhost') || RAW_BACKEND_URL.includes('127.0.0.1')
    ? DEFAULT_WEBSITE_API_BASE
    : RAW_BACKEND_URL;

if (process.env.NODE_ENV === 'production' && !process.env.BACKEND_URL) {
  throw new Error('BACKEND_URL is not defined in environment variables (required in production)');
}

// Production detection
const isProduction =
  process.env.NODE_ENV === 'production' ||
  (!WEBSITE_API_BASE.includes('localhost') && !WEBSITE_API_BASE.includes('127.0.0.1'));

// Simple in-memory cache so production doesn't re-fetch on every boss login/page refresh
// and users don't feel like "token bar bar mang raha hai".
const WEBSITE_ENQUIRIES_CACHE_TTL_MS = Number(process.env.WEBSITE_ENQUIRIES_CACHE_TTL_MS || 2 * 60 * 1000); // 2 min default
let enquiriesCache = {
  fetchedAt: 0,
  sourceBase: null,
  data: null,
};

function extractNetworkErrorCode(err) {
  // Node/undici often throws: TypeError('fetch failed') with `cause: AggregateError`
  // where the real per-socket errors live at `err.cause.errors[]`.
  const direct = err?.code;
  if (direct) return direct;

  const causeCode = err?.cause?.code;
  if (causeCode) return causeCode;

  const nestedErrors = err?.cause?.errors;
  if (Array.isArray(nestedErrors) && nestedErrors.length) {
    return nestedErrors.find(e => e?.code)?.code;
  }

  return undefined;
}

function isLocalhostUrl(url) {
  return typeof url === 'string' && (url.includes('localhost') || url.includes('127.0.0.1'));
}

function isCacheFresh() {
  if (!enquiriesCache?.data) return false;
  return Date.now() - enquiriesCache.fetchedAt < WEBSITE_ENQUIRIES_CACHE_TTL_MS;
}

function getBearerTokenFromRequest(req) {
  const authHeader = req?.headers?.authorization || req?.headers?.Authorization;
  if (!authHeader) return null;
  const raw = String(authHeader).trim();
  if (!raw) return null;
  if (raw.toLowerCase().startsWith('bearer ')) return raw.slice(7).trim();
  return raw; // if caller sends raw token
}

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

    // Serve cache immediately if still fresh
    if (isCacheFresh()) {
      return res.json({
        success: true,
        message: 'Enquiries fetched successfully (cache)',
        data: enquiriesCache.data,
        total: enquiriesCache.data.length,
        meta: {
          source: '100acress.com',
          authMethod: 'cached',
          apiBase: enquiriesCache.sourceBase || WEBSITE_API_BASE,
          fetchedAt: new Date(enquiriesCache.fetchedAt).toISOString(),
          userRole,
          isProduction,
          cache: {
            ttlMs: WEBSITE_ENQUIRIES_CACHE_TTL_MS,
            ageMs: Date.now() - enquiriesCache.fetchedAt
          }
        }
      });
    }

    // Prefer the caller's CRM login token for 100acress API auth.
    // This removes the dependency on SERVICE_TOKEN in production for boss users.
    const callerToken = getBearerTokenFromRequest(req);

    // Fallback to service token if caller token is missing
    const serviceToken = callerToken ? null : await getValidToken();
    const authMethod = callerToken ? 'user-token (from CRM login)' : 'service-token (auto-refresh)';

    if (!callerToken && !serviceToken) {
      const tokenStatus = getTokenStatus();
      // If we have a stale cache, serve it instead of failing the boss UI.
      if (enquiriesCache?.data?.length) {
        return res.status(200).json({
          success: true,
          message: 'Enquiries served from stale cache (token unavailable)',
          data: enquiriesCache.data,
          total: enquiriesCache.data.length,
          meta: {
            source: '100acress.com',
            authMethod: 'stale-cache',
            apiBase: enquiriesCache.sourceBase || WEBSITE_API_BASE,
            fetchedAt: new Date(enquiriesCache.fetchedAt).toISOString(),
            userRole,
            isProduction,
            tokenStatus
          }
        });
      }

      return res.status(503).json({
        success: false,
        message:
          'Website enquiries temporarily unavailable (token missing/invalid). ' +
          'Set SERVICE_TOKEN or ACRESS_ADMIN_EMAIL/ACRESS_ADMIN_PASSWORD on the CRM backend.',
        debug: {
          tokenStatus,
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
      'x-access-token': callerToken || serviceToken
    };

    console.log(`🌐 Fetching from: ${WEBSITE_API_BASE}/crm/enquiries?limit=${limit}`);
    console.log(`🔐 Auth method: ${authMethod}`);

    const requestPath = `/crm/enquiries?limit=${limit}`;
    let response;

    // Fetch enquiries from 100acress backend (with localhost fallback)
    try {
      response = await fetch(`${WEBSITE_API_BASE}${requestPath}`, {
        method: 'GET',
        headers
      });
    } catch (fetchError) {
      const code = extractNetworkErrorCode(fetchError);

      // If dev env is pointing to localhost:3500 but that service is down,
      // automatically fall back to the public API to keep CRM usable.
      if (
        code === 'ECONNREFUSED' &&
        isLocalhostUrl(WEBSITE_API_BASE) &&
        WEBSITE_API_BASE !== DEFAULT_WEBSITE_API_BASE
      ) {
        console.warn(
          `⚠️ Website Enquiries: ${WEBSITE_API_BASE} refused connection; retrying with ${DEFAULT_WEBSITE_API_BASE}`
        );
        response = await fetch(`${DEFAULT_WEBSITE_API_BASE}${requestPath}`, {
          method: 'GET',
          headers
        });
      } else {
        throw fetchError;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      // If token is expired on production API:
      // - If using user-token, user needs to re-login (we cannot refresh their token here).
      // - If using service-token, force-refresh and retry once automatically.
      if (response.status === 401 && errorText && errorText.includes('Token expired') && !callerToken) {
        console.warn('🔄 Website Enquiries: Token expired; forcing refresh and retrying once...');
        const refreshed = await forceRefreshToken();
        if (refreshed) {
          const retryResponse = await fetch(`${WEBSITE_API_BASE}${requestPath}`, {
            method: 'GET',
            headers: {
              ...headers,
              'x-access-token': refreshed
            }
          });

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            const transformedRetry = (retryData.data || retryData.users || retryData || []).map(enquiry => ({
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
              assignedTo: null,
              assignedToName: 'Unassigned',
              priority: enquiry.priority || 'medium',
              followUpDate: null,
              lastContactDate: enquiry.createdAt || new Date(),
              notes: enquiry.message || enquiry.requirement || '',
              originalEnquiry: enquiry
            }));

            enquiriesCache = {
              fetchedAt: Date.now(),
              sourceBase: WEBSITE_API_BASE,
              data: transformedRetry
            };

            return res.json({
              success: true,
              message: 'Enquiries fetched successfully',
              data: transformedRetry,
              total: transformedRetry.length,
              meta: {
                source: '100acress.com',
                authMethod: 'service-token (auto-refresh)',
                apiBase: WEBSITE_API_BASE,
                fetchedAt: new Date().toISOString(),
                userRole,
                isProduction,
                retriedAfterRefresh: true
              }
            });
          }
        }
      }
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

    // Update cache
    enquiriesCache = {
      fetchedAt: Date.now(),
      sourceBase: WEBSITE_API_BASE,
      data: transformedEnquiries
    };

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
    const networkCode = extractNetworkErrorCode(error);
    console.error('❌ Full error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: networkCode || error.code,
      errno: error.errno,
      syscall: error.syscall,
      address: error.address,
      port: error.port
    });

    // Check if it's a network/connectivity error
    if (networkCode === 'ECONNREFUSED' || networkCode === 'ENOTFOUND') {
      // Serve stale cache if available (keeps boss CRM usable in production)
      if (enquiriesCache?.data?.length) {
        return res.status(200).json({
          success: true,
          message: 'Enquiries served from stale cache (network error)',
          data: enquiriesCache.data,
          total: enquiriesCache.data.length,
          meta: {
            source: '100acress.com',
            authMethod: 'stale-cache',
            apiBase: enquiriesCache.sourceBase || WEBSITE_API_BASE,
            fetchedAt: new Date(enquiriesCache.fetchedAt).toISOString(),
            userRole: req.user?.role,
            isProduction,
            errorCode: networkCode
          }
        });
      }

      return res.status(500).json({
        success: false,
        message:
          `Cannot connect to 100acress backend at ${WEBSITE_API_BASE}. ` +
          `If BACKEND_URL is set to http://localhost:3500, make sure the 100acress backend is running on port 3500 ` +
          `or change BACKEND_URL to https://api.100acress.com.`,
        error: error.message,
        debug: {
          apiBase: WEBSITE_API_BASE,
          errorCode: networkCode,
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
        tokenStatus: getTokenStatus(),
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

    // Prefer caller token; fallback to service token
    const callerToken = getBearerTokenFromRequest(req);
    const serviceToken = callerToken ? null : await getValidToken();
    if (!callerToken && !serviceToken) {
      return res.status(500).json({
        success: false,
        message: 'No valid token available. Add ACRESS_ADMIN_EMAIL and ACRESS_ADMIN_PASSWORD to .env.'
      });
    }

    // Fetch Excel file from 100acress backend
    const response = await fetch(`${WEBSITE_API_BASE}/crm/enquiries/download`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': callerToken || serviceToken
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
