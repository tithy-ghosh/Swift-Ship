import axiosSecure from '@/utils/axiosSecure';

export const submitRiderApplication = async (applicationData) => {
  const { data } = await axiosSecure.post('/rider-applications', applicationData);
  return data;
};