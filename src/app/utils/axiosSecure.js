import axios from 'axios';
import { auth } from '@/app/firebase/firebase.init'; // ✅ Verify this path matches your firebase init file

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// REQUEST INTERCEPTOR
axiosSecure.interceptors.request.use(
  async (config) => {
    try {
      // Wait for auth to be ready
      const user = auth.currentUser;
      
      if (!user) {
        console.warn('️ No user found in auth.currentUser');
        return config;
      }

      // Get a fresh token (forceRefresh ensures we get a valid one)
      const token = await user.getIdToken(true);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token attached to request:', config.url);
      } else {
        console.error('❌ getIdToken() returned null');
      }
      
      return config;
    } catch (error) {
      console.error('❌ Error getting token:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.error('Unauthorized: Token expired or invalid.');
      // Optional: redirect to login
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;