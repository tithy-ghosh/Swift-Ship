import axiosSecure from "@/utils/axiosSecure";

export const getSettings = async () => {
  const { data } = await axiosSecure.get('/api/settings');
  return data;
};

export const updateSettings = async (settingsData) => {
  const { data } = await axiosSecure.put('/api/settings', settingsData);
  return data;
};

export const updatePricingSettings = async (pricingData) => {
  const { data } = await axiosSecure.patch('/api/settings/pricing', pricingData);
  return data;
};

export const updateSystemSettings = async (systemData) => {
  const { data } = await axiosSecure.patch('/api/settings/system', systemData);
  return data;
};

export const getPublicSettings = async () => {
  const { data } = await axiosSecure.get('/api/settings/public');
  return data;
};