import axiosSecure from "@/utils/axiosSecure";

export const getAdminStats = async() => {
    const { data } = await axiosSecure.get('/api/admin/stats');
    return data;
};