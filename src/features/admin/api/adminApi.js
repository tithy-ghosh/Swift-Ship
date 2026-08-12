import axiosSecure from "@/utils/axiosSecure";

export const getAdminStats = async() => {
    const { data } = await axiosSecure.get('/admin/stats');
    return data;
};