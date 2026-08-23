import axiosSecure from "@/utils/axiosSecure";

export const getAllParcels = async () => {
  const { data } = await axiosSecure.get('/api/parcels');
  return data;
};