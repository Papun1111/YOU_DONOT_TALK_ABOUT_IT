import axios from 'axios';
import { type ApiErrorResponse } from '../types';

// Get the base URL from environment variables, with a fallback for development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending session cookies
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// Log requests in development
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// This will process every response from the API.
apiClient.interceptors.response.use(
  // If the response is successful (2xx status code), just return it.
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  // If the response is an error...
  (error) => {
    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        data: error.response?.data,
      });
    }

    // Check if the error has a response from the server.
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as ApiErrorResponse;
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - could redirect to login or clear auth state
          console.warn('🔐 Unauthorized request - user may need to log in');
          break;
        case 403:
          // Forbidden
          console.warn('🚫 Forbidden request - user lacks permissions');
          break;
        case 404:
          // Not found
          console.warn('🔍 Resource not found');
          break;
        case 500:
          // Server error
          console.error('🔥 Server error occurred');
          break;
      }

      // Create a new error with the message from our backend's standardized response.
      const errorMessage = errorData.message || 
        `Request failed with status ${error.response.status}` || 
        'An unexpected error occurred.';
      
      return Promise.reject(new Error(errorMessage));
    }

    // Handle network errors or other issues.
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    
    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Default error handling
    return Promise.reject(new Error(error.message || 'An unexpected error occurred.'));
  }
);

export default apiClient;