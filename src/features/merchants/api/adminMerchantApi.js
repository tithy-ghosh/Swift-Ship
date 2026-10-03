import axiosSecure from '@/utils/axiosSecure';

/**
 * Admin-side merchant application endpoints. These mirror the rider
 * counterparts in `features/riders/api/adminRiderApi.js` so the two review
 * queues stay symmetrical.
 */

export const getAllMerchantApplications = async (status = '') => {
  const url = status
    ? `/api/merchant-applications?status=${status}`
    : '/api/merchant-applications';

  const { data } = await axiosSecure.get(url);
  return data;
};

export const approveMerchantApplication = async (id, adminNotes = '') => {
  const { data } = await axiosSecure.put(
    `/api/merchant-applications/${id}/approve`,
    { adminNotes },
  );
  return data;
};

export const rejectMerchantApplication = async (id, reason = '') => {
  const { data } = await axiosSecure.put(
    `/api/merchant-applications/${id}/reject`,
    { reason },
  );
  return data;
};
