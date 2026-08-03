import axiosSecure from "@/utils/axiosSecure";

/** 
 * Create or update user profile in MongoDB after login 
 * Matches backend route: POST /api/users
 */
export const ensureUserProfile = async (userData) => {
  const { data } = await axiosSecure.post('/users', userData);
  return data;
};

/** 
 * Get current user's profile from the backend 
 * Matches the backend route: GET /api/users/me
 * (Note: We only use '/users/me' because axiosSecure already adds '/api')
 */
export const getUserProfile = async () => {
  const { data } = await axiosSecure.get('/api/users/me');
  return data;
};

/** 
 * Update current user's profile 
 * Matches the backend route: PUT /api/users/me
 */
export const updateUserProfile = async (profileData) => {
  const { data } = await axiosSecure.put('/api/users/me', profileData);
  return data;
};