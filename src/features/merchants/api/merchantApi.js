import axiosSecure from '@/utils/axiosSecure';

/**
 * Submit a merchant application. A merchant may apply while logged out and is
 * asked to sign in only at submit time, so the request carries the Firebase
 * token via the shared interceptor like every other secure call.
 *
 * Matches backend route: POST /api/merchant-applications
 */
export const submitMerchantApplication = async (applicationData) => {
  const { data } = await axiosSecure.post('/api/merchant-applications', applicationData);
  return data;
};
