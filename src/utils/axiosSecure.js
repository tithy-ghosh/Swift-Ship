import axios from 'axios';
import { auth } from '@/app/firebase/firebase.init'; 

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// REQUEST INTERCEPTOR: Automatically attaches the Firebase token
axiosSecure.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    
    if (user) {
      // Gets a fresh token (Firebase handles caching/refreshing automatically)
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handles 401/403 errors globally
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.error('Unauthorized: Token expired or invalid.');
      // Optional: Redirect to login or trigger logout
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;