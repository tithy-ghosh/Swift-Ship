import axiosSecure from '../parcels/utils/axiosSecure';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const readApiError = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const result = await response.json();
    return result.error || result.message;
  }

  return response.text();
};

/**
 * Ensures an authenticated Firebase user has a matching database profile.
 * Safe to call after every sign-in because the backend upserts the profile.
 */
export const ensureUserProfile = async (firebaseUser, profile = {}) => {
  if (!API_URL) throw new Error('Backend API URL is missing.');
  if (!firebaseUser) throw new Error('No authenticated user was provided.');

  const token = await firebaseUser.getIdToken();
  let response;
  try {
    response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: profile.name ?? firebaseUser.displayName ?? '',
        email: firebaseUser.email ?? '',
        phone: profile.phone ?? firebaseUser.phoneNumber ?? '',
        photoURL: firebaseUser.photoURL ?? '',
        provider: firebaseUser.providerData?.[0]?.providerId ?? 'password',
      }),
    });
  } catch {
    throw new Error('Could not connect to the delivery server. Make sure it is running at the configured API URL.');
  }

  if (!response.ok) {
    const message = await readApiError(response);
    throw new Error(message || 'Could not save your account details.');
  }

  return response.json();
};

/** 
 * Get current user's profile from the backend 
 * Matches your backend route: GET /api/users/me
 */
export const getUserProfile = async () => {
  const { data } = await axiosSecure.get('/users/me');
  return data;
};

/** 
 * Update current user's profile 
 * Matches your backend route: PUT /api/users/me
 */
export const updateUserProfile = async (profileData) => {
  const { data } = await axiosSecure.put('/users/me', profileData);
  return data;
};
