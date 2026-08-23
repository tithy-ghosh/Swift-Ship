import axiosSecure from "@/utils/axiosSecure";

export const getAllPayments = async () => {
  const { data } = await axiosSecure.get('/api/payment'); 
  return data;
};