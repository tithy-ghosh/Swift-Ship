import axiosSecure from '@/utils/axiosSecure';

export const submitRiderApplication = async (applicationData) => {
  const { data } = await axiosSecure.post('/api/rider-applications', applicationData);
  return data;
};