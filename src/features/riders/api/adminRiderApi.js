import axiosSecure from "@/utils/axiosSecure";

// Get all applications (optionally filter by status)

export const getAllRiderApplications = async (status = '') => {
  const url = status ? `/rider-application?status=${status}` : '/rider-application';

  const { data } = await axiosSecure.get(url);
  return data;
};

// Approve an application
export const approveRiderApplication = async (id, adminNotes = '') => {
  const { data } = await axiosSecure.put(`/rider-applications/${id}/approve`, { adminNotes });
  return data;
};

// Reject an application
export const rejectRiderApplication = async (id, reason = '') => {
  const { data } = await axiosSecure.put(`/rider-applications/${id}/reject`, { reason });
  return data;
};