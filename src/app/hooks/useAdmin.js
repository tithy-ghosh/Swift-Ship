'use client';

import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import { getUserProfile } from "@/features/users/api/userApi";

export const useAdmin = () => {
    const { user, loading } = useAuth();
    const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: !!user,
  });
  const isAdmin = profile?.role === 'admin';
  const isLoading = loading || profileLoading

  return{ user, profile, isAdmin, isLoading }
};

export default useAdmin;