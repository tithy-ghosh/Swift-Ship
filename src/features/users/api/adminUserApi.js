import axiosSecure from "@/utils/axiosSecure";

export const getAllUsers = async () =>{
    const { data } = await axiosSecure.get('/api/users');
    return data;
};
export const deleteUser = async (id) => {
  const { data } = await axiosSecure.delete(`/api/users/${id}`);
  return data;
};

