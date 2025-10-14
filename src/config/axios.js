import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  // Use environment variable for API URL
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 15000, // 15 second timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token and retry config
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add retry configuration
    config.__retryCount = config.__retryCount || 0;
    config.__maxRetries = config.__maxRetries || 3;
    
    // Log request for debugging
    if (config.__retryCount === 0) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.log(`🔄 Retry ${config.__retryCount}/${config.__maxRetries} - ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors with retry logic
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.__retryCount === 0) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    } else {
      console.log(`✅ Retry Success - ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    
    // Don't retry if we don't have a config or if it's a 401 (auth error)
    if (!config || error.response?.status === 401) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Don't force redirect here - let React Router handle it
        console.log('🔐 Token expired or invalid - clearing auth data');
      }
      return Promise.reject(error);
    }
    
    // Check if we should retry
    const shouldRetry = (
      config.__retryCount < config.__maxRetries &&
      (
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNREFUSED' ||
        error.response?.status >= 500 ||
        !error.response
      )
    );
    
    if (shouldRetry) {
      config.__retryCount += 1;
      
      // Exponential backoff: wait 1s, 2s, 4s for retries
      const backoffDelay = Math.pow(2, config.__retryCount - 1) * 1000;
      console.log(`⏱️ Waiting ${backoffDelay}ms before retry...`);
      
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      
      // Retry the request
      return axiosInstance(config);
    }
    
    // Log the final error
    console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`);
    
    // Handle specific error types
    if (error.code === 'ERR_NETWORK') {
      console.error('🚫 Network Error - Server may be down or CORS issue');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
