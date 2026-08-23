"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUser } from "@/features/users/api/adminUserApi";
import axiosSecure from "@/utils/axiosSecure";
import AdminRoute from "@/app/components/admin/AdminRoute";
import {
  MdDelete,
  MdPerson,
  MdWarning,
  MdSearch,
  MdClear,
  MdAdminPanelSettings,
} from "react-icons/md";

export default function AllUsersPage() {
  const queryClient = useQueryClient();

  // Separate state for what the user is typing vs what is actively being searched
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      alert("User deleted successfully");
    },
    onError: (err) =>
      alert("Failed to delete: " + (err.response?.data?.error || err.message)),
  });
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const { data } = await axiosSecure.put(`/api/users/${id}/role`, { role });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      alert("User role updated successfully");
    },
    onError: (err) =>
      alert(
        "Failed to update role: " + (err.response?.data?.error || err.message),
      ),
  });
  // Trigger search only when button is clicked
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearchTerm(searchQuery);
  };

  // Clear the search
  const handleClear = () => {
    setSearchQuery("");
    setActiveSearchTerm("");
  };

  // Filter based on the ACTIVE search term, not the typing state
  const filteredUsers = users?.filter(
    (user) =>
      user.name?.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(activeSearchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-[#f7fbf5]">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="gap-2 flex flex-col mx-auto justify-center items-center">
                <div className="px-6 py-1 bg-[#D9EFBD] rounded-full">
                    <p className="text-sm tracking-[0.2em] font-bold text-[#1D2128]">
              All Users
            </p>
                </div>
            <p className="text-[#2c2e2a] mb-4 text-2xl tracking-wider font-sans">
              Manage all registered users in the system
            </p>
            </div>

            {/* Search Bar with Button */}
            <form onSubmit={handleSearch} className=" flex mb-6 mt-6 gap-2 justify-end">
                <div className="relative flex gap-2">
                    <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  className="input input-bordered w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* Clear Button (only shows when typing) */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <MdClear className="size-5" />
                  </button>
                )}
              <button
                type="submit"
                className="btn bg-[#83BD75] text-[#172015] hover:bg-[#74ad68]"
              >
                <MdSearch className="size-5" /> Search
              </button>
                </div>
            </form>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-[#dce8d8] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead className="bg-[#edf7ea]">
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers?.length > 0 ? (
                      filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar placeholder">
                                <div className="bg-[#4d8d41] text-white rounded-full w-10 flex items-center justify-center">
                                  <MdPerson className="size-5" />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <select
                              value={user.role}
                              onChange={(e) => {
                                if (
                                  confirm(
                                    `Change ${user.name}'s role to ${e.target.value}?`,
                                  )
                                ) {
                                  roleMutation.mutate({
                                    id: user._id,
                                    role: e.target.value,
                                  });
                                }
                              }}
                              className={`select select-sm ${user.role === "admin" ? "select-error" : user.role === "rider" ? "select-info" : "select-success"}`}
                            >
                              <option value="customer">Customer</option>
                              <option value="rider">Rider</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
                                  )
                                ) {
                                  deleteMutation.mutate(user._id);
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              className="btn btn-sm btn-error text-white"
                            >
                              <MdDelete /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-[#596257]"
                        >
                          {activeSearchTerm
                            ? `No users found matching "${activeSearchTerm}"`
                            : "No users found in the system."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}
