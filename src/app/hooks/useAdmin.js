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
  const role = profile?.role;
  const isAdmin = role === 'admin';
  const isMerchant = role === 'merchant';
  const isLoading = loading || profileLoading

  return{ user, profile, role, isAdmin, isMerchant, isLoading }
};

export default useAdmin;