// Environment configuration for different deployment targets
interface EnvironmentConfig {
  API_BASE_URL: string;
  STRIPE_PUBLISHABLE_KEY: string;
  YOCO_PUBLIC_KEY: string;
  YOCO_AZURE_FUNCTION_URL: string;
  PAYFAST_MERCHANT_ID: string;
  PAYFAST_MERCHANT_KEY: string;
  PAYFAST_MODE: 'sandbox' | 'live';
  SITE_URL: string;
  BACKEND_ENABLED?: boolean;
}

const config: Record<string, EnvironmentConfig> = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    STRIPE_PUBLISHABLE_KEY: 'pk_test_5d0d5f771WOYrd3899d4',
    YOCO_PUBLIC_KEY: 'pk_test_5d0d5f771WOYrd3899d4', // Your actual Yoco public key
    YOCO_AZURE_FUNCTION_URL: 'https://tap4functions-f5cxaebacke5etbu.southafricanorth-01.azurewebsites.net/api/ChargeToken?code=I_2sMdkLcMos3ixlowrcBqjv8kvTS8z0fN3xHE2YFH0LAzFu93m4VQ==',
    // Using LIVE credentials for testing
    PAYFAST_MERCHANT_ID: '32033651',
    PAYFAST_MERCHANT_KEY: 'nkcuv3ojaaabh',
    PAYFAST_MODE: 'live',
    SITE_URL: 'https://www.example.com',  // Use a real domain for testing
    BACKEND_ENABLED: true
  },
  production: {
    API_BASE_URL: 'https://your-backend-url.com/api', // Update this with your backend URL
    STRIPE_PUBLISHABLE_KEY: 'pk_test_5d0d5f771WOYrd3899d4',
    YOCO_PUBLIC_KEY: 'pk_test_5d0d5f771WOYrd3899d4', // Replace with your live Yoco public key
    YOCO_AZURE_FUNCTION_URL: 'https://your-function-app.azurewebsites.net/api/ProcessYocoPayment',
    PAYFAST_MERCHANT_ID: '32033651',
    PAYFAST_MERCHANT_KEY: 'nkcuv3ojaaabh',
    PAYFAST_MODE: 'live',
    SITE_URL: 'https://jacquim.github.io/Tap4Impact',
    BACKEND_ENABLED: true
  },
  'github-pages': {
    API_BASE_URL: 'https://your-backend-url.com/api', // Update this with your backend URL
    STRIPE_PUBLISHABLE_KEY: 'pk_test_5d0d5f771WOYrd3899d4',
    YOCO_PUBLIC_KEY: 'pk_test_5d0d5f771WOYrd3899d4', // Replace with your live Yoco public key
    YOCO_AZURE_FUNCTION_URL: 'https://your-function-app.azurewebsites.net/api/ProcessYocoPayment',
    PAYFAST_MERCHANT_ID: '32033651',
    PAYFAST_MERCHANT_KEY: 'nkcuv3ojaaabh',
    PAYFAST_MODE: 'live',
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
