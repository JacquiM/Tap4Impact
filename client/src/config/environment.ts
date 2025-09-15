// Environment configuration for different deployment targets
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_test_key',
    SITE_URL: 'http://localhost:5173'
  },
  production: {
    API_BASE_URL: 'https://your-backend-url.com/api', // Update this with your backend URL
    STRIPE_PUBLISHABLE_KEY: 'pk_live_your_stripe_live_key',
    SITE_URL: 'https://jacquim.github.io/Tap4Impact'
  },
  'github-pages': {
    API_BASE_URL: 'https://your-backend-url.com/api', // Update this with your backend URL
    STRIPE_PUBLISHABLE_KEY: 'pk_live_your_stripe_live_key',
    SITE_URL: 'https://jacquim.github.io/Tap4Impact',
    // For GitHub Pages without backend, you might want to disable certain features
    BACKEND_ENABLED: false
  }
};

// Determine environment
const getEnvironment = () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return 'github-pages';
  }
  return import.meta.env.MODE || 'development';
};

const environment = getEnvironment();
export const ENV_CONFIG = config[environment as keyof typeof config] || config.development;

// Helper to check if backend features are available
export const isBackendEnabled = () => {
  return ENV_CONFIG.BACKEND_ENABLED !== false;
};

// Helper to get API URL
export const getApiUrl = (endpoint: string) => {
  if (!isBackendEnabled()) {
    console.warn(`Backend not available for endpoint: ${endpoint}`);
    return null;
  }
  return `${ENV_CONFIG.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
