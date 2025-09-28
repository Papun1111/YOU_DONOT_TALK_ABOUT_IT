import axios from 'axios';
import { type ApiErrorResponse } from '../types';

// Get the base URL from environment variables, with a fallback for development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This is crucial for sending session cookies
});

// --- Response Interceptor ---
// This will process every response from the API.
apiClient.interceptors.response.use(
  // If the response is successful (2xx status code), just return it.
  (response) => response,
  // If the response is an error...
  (error) => {
    // Check if the error has a response from the server.
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data as ApiErrorResponse;
      // We create a new error with the message from our backend's standardized response.
      // This makes handling errors in components much cleaner.
      return Promise.reject(new Error(errorData.message || 'An unexpected error occurred.'));
    }
    // Handle network errors or other issues.
    return Promise.reject(error);
  }
);

export default apiClient;
