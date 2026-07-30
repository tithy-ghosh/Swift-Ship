import axios from 'axios';

// 1. Create the base instance
const axiosSecure = axios.create({
  // Use the backend URL from .env
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
});

// 2. REQUEST INTERCEPTOR: Runs before every request
axiosSecure.interceptors.request.use(
  (config) => {
    // Get the Firebase ID token from localStorage
    const token = localStorage.getItem('firebaseToken');
    
    if (token) {
      // Attach it to the Authorization header for firebase-admin to verify
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. RESPONSE INTERCEPTOR: Runs after the backend responds
axiosSecure.interceptors.response.use(
  (response) => response, // If successful, return data normally
  (error) => {
    const status = error.response?.status;

    // 401 = Unauthorized (token expired/invalid), 403 = Forbidden
    if (status === 401 || status === 403) {
      // Clear the invalid token
      localStorage.removeItem('firebaseToken');
      
      // Force redirect to login page (works universally in Next.js App/Pages router)
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;