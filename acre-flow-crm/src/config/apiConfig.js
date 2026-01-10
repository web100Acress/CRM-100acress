// API Configuration Helper
// Automatically detects localhost and uses appropriate base URL

const getApiBaseUrl = () => {
  // Check for environment variable first
  if (import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check if running on localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Default CRM backend port - can be overridden with env variable
    const localPort = import.meta.env?.VITE_LOCAL_API_PORT || '5001';
    return `http://localhost:${localPort}`;
  }
  
  // Production URL
  return 'https://bcrm.100acress.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper to create full API URL
export const apiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Check if endpoint already has full URL (for query params, etc)
  if (cleanEndpoint.includes('?')) {
    // For endpoints with query params, add /api/ prefix if not present
    const [path, query] = cleanEndpoint.split('?');
    const finalPath = path.startsWith('api/') ? path : `api/${path}`;
    return `${API_BASE_URL}/${finalPath}?${query}`;
  }
  
  // Add 'api/' prefix if not already present
  const finalEndpoint = cleanEndpoint.startsWith('api/') ? cleanEndpoint : `api/${cleanEndpoint}`;
  return `${API_BASE_URL}/${finalEndpoint}`;
};

// Log for debugging
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 API Config: Using localhost backend:', API_BASE_URL);
} else {
  console.log('🔧 API Config: Using production backend:', API_BASE_URL);
}

export default API_BASE_URL;

