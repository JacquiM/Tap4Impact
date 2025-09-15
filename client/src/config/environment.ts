// Environment configuration for different deployment targets
interface EnvironmentConfig {
  API_BASE_URL: string;
  STRIPE_PUBLISHABLE_KEY: string;
  SITE_URL: string;
  BACKEND_ENABLED?: boolean;
}

const config: Record<string, EnvironmentConfig> = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_test_key',
    SITE_URL: 'http://localhost:5173',
    BACKEND_ENABLED: true
  },
  production: {
    API_BASE_URL: 'https://your-backend-url.com/api', // Update this with your backend URL
    STRIPE_PUBLISHABLE_KEY: 'pk_live_your_stripe_live_key',
    SITE_URL: 'https://jacquim.github.io/Tap4Impact',
    BACKEND_ENABLED: true
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
  // Check if we're in development mode
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'development';
  }
  return 'production';
};

const environment = getEnvironment();
export const ENV_CONFIG = config[environment] || config.development;

// Helper to check if backend features are available
export const isBackendEnabled = (): boolean => {
  return ENV_CONFIG.BACKEND_ENABLED !== false;
};

// Helper to get API URL
export const getApiUrl = (endpoint: string): string | null => {
  if (!isBackendEnabled()) {
    console.warn(`Backend not available for endpoint: ${endpoint}`);
    return null;
  }
  return `${ENV_CONFIG.API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};
