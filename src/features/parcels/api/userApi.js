import axiosSecure from "../utils/axiosSecure";
/** 
 * Get current user's profile from the backend 
 * Matches the backend route: GET /users/me
 */

export const getUserProfile = async () => {
  const { data } = await axiosSecure.get('/users/me');
  return data;
};

/** 
 * Update current user's profile 
 * Matches your backend route: PUT /users/me
 */
export const updateUserProfile = async (profileData) => {
  const { data } = await axiosSecure.put('/users/me', profileData);
  return data;
};