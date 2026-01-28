/**
 * Token Refresh Service for 100acress API
 * Automatically manages JWT tokens for API authentication
 * 
 * Features:
 * - Auto-login on server start
 * - Token refresh every 6 hours (before 7-day expiration)
 * - Fallback to SERVICE_TOKEN from .env if auto-login fails
 * - In-memory token storage (no file writes)
 */

const jwt = require('jsonwebtoken');

// Configuration
const ACRESS_API_BASE = process.env.BACKEND_URL || 'https://api.100acress.com';
const TOKEN_REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

// In-memory token storage
let currentToken = null;
let tokenExpiresAt = null;
let refreshInterval = null;

/**
 * Check if a JWT token is expired or about to expire
 * @param {string} token - JWT token to check
 * @returns {boolean} - true if expired or expiring within 1 hour
 */
const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        const currentTime = Math.floor(Date.now() / 1000);

        // Consider expired if within 1 hour of expiration
        const expirationBuffer = 60 * 60; // 1 hour
        return !payload.exp || (payload.exp - expirationBuffer) < currentTime;
    } catch (error) {
        console.error('🔑 Token Service: Error checking token expiration:', error.message);
        return true;
    }
};

/**
 * Get token expiration date from JWT
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null
 */
const getTokenExpiration = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch {
        return null;
    }
};

const loginAndGetToken = async () => {
    const email = process.env.ACRESS_ADMIN_EMAIL?.trim();
    const password = process.env.ACRESS_ADMIN_PASSWORD?.trim();

    console.log('🔑 Token Service: Checking credentials...');
    console.log(`   Email set: ${email ? 'Yes (' + email + ')' : 'No'}`);
    console.log(`   Password set: ${password ? 'Yes (length: ' + password.length + ')' : 'No'}`);

    if (!email || !password) {
        console.warn('🔑 Token Service: ACRESS_ADMIN_EMAIL or ACRESS_ADMIN_PASSWORD not set in .env');
        console.warn('🔑 Token Service: Add these to enable automatic token refresh:');
        console.warn('   ACRESS_ADMIN_EMAIL=info@100acress.com');
        console.warn('   ACRESS_ADMIN_PASSWORD=<your_password>');
        return null;
    }

    // Try multiple possible login endpoints
    const loginEndpoints = [
        `${ACRESS_API_BASE}/api/auth/login`,
        `${ACRESS_API_BASE}/auth/login`,
        `${ACRESS_API_BASE}/api/user/login`,
        `${ACRESS_API_BASE}/login`
    ];

    for (const endpoint of loginEndpoints) {
        try {
            console.log(`🔑 Token Service: Trying login at ${endpoint}...`);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log(`   Response status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                const token = data.token || data.accessToken || data.data?.token;

                if (token) {
                    const expiration = getTokenExpiration(token);
                    console.log(`✅ Token Service: Fresh token obtained from ${endpoint}!`);
                    if (expiration) {
                        console.log(`   Expires: ${expiration.toLocaleString()}`);
                    }
                    return token;
                } else {
                    console.log('   No token in response:', JSON.stringify(data).substring(0, 100));
                }
            } else {
                const errorText = await response.text();
                console.log(`   Failed: ${errorText.substring(0, 100)}`);
            }
        } catch (error) {
            console.log(`   Error: ${error.message}`);
        }
    }

    console.error('🔑 Token Service: All login endpoints failed');
    return null;
};

/**
 * Refresh the token
 */
const refreshToken = async () => {
    console.log('🔄 Token Service: Refreshing token...');

    const newToken = await loginAndGetToken();

    if (newToken) {
        currentToken = newToken;
        tokenExpiresAt = getTokenExpiration(newToken);
        console.log('✅ Token Service: Token refreshed successfully');
    } else {
        console.warn('⚠️ Token Service: Refresh failed, will retry on next interval');
        // Keep using old token or fallback to env
    }
};

/**
 * Initialize the token refresh service
 * Should be called on server startup
 */
const initializeTokenService = async () => {
    console.log('🔑 Token Service: Initializing...');

    // Try to get initial token
    const freshToken = await loginAndGetToken();

    if (freshToken) {
        currentToken = freshToken;
        tokenExpiresAt = getTokenExpiration(freshToken);
    } else {
        // Fallback to env token
        if (process.env.SERVICE_TOKEN) {
            console.log('🔑 Token Service: Using SERVICE_TOKEN from .env as fallback');
            currentToken = process.env.SERVICE_TOKEN;
            tokenExpiresAt = getTokenExpiration(currentToken);

            if (isTokenExpired(currentToken)) {
                console.warn('⚠️ Token Service: SERVICE_TOKEN from .env is expired!');
                console.warn('   Add ACRESS_ADMIN_EMAIL and ACRESS_ADMIN_PASSWORD to .env for auto-refresh');
            }
        } else {
            console.error('❌ Token Service: No token available! Add credentials to .env');
        }
    }

    // Schedule periodic refresh
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }

    refreshInterval = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
    console.log(`🔄 Token Service: Scheduled refresh every ${TOKEN_REFRESH_INTERVAL / (60 * 60 * 1000)} hours`);

    return currentToken;
};

/**
 * Get a valid (non-expired) token
 * Automatically refreshes if current token is expired
 * @returns {Promise<string|null>} - Valid token or null
 */
const getValidToken = async () => {
    // If current token is expired, try to refresh
    if (isTokenExpired(currentToken)) {
        console.log('🔑 Token Service: Current token expired, refreshing...');
        await refreshToken();
    }

    // Return current token or fallback to env
    if (currentToken && !isTokenExpired(currentToken)) {
        return currentToken;
    }

    // Last resort: return env token even if expired
    if (process.env.SERVICE_TOKEN) {
        console.warn('⚠️ Token Service: Using potentially expired SERVICE_TOKEN from .env');
        return process.env.SERVICE_TOKEN;
    }

    return null;
};

/**
 * Get current token status for debugging
 */
const getTokenStatus = () => {
    return {
        hasToken: !!currentToken,
        isExpired: isTokenExpired(currentToken),
        expiresAt: tokenExpiresAt?.toISOString() || null,
        hasEnvToken: !!process.env.SERVICE_TOKEN,
        hasCredentials: !!(process.env.ACRESS_ADMIN_EMAIL && process.env.ACRESS_ADMIN_PASSWORD),
        refreshIntervalHours: TOKEN_REFRESH_INTERVAL / (60 * 60 * 1000),
    };
};

/**
 * Stop the token refresh service
 */
const stopTokenService = () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        console.log('🔑 Token Service: Stopped');
    }
};

module.exports = {
    initializeTokenService,
    getValidToken,
    getTokenStatus,
    stopTokenService,
    isTokenExpired,
};
