'use client';

import { useState, useEffect } from 'react'; //  Add useEffect
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllRiderApplications } from '@/features/riders/api/adminRiderApi';
import AdminRoute from '@/app/components/admin/AdminRoute';
import useAuth from '@/app/hooks/useAuth'; // 
import { MdCheckCircle, MdClose, MdHourglassEmpty, MdWarning } from 'react-icons/md';

export default function PendingRidersPage() {
  const { user, loading: authLoading } = useAuth(); // ✅ Get auth state
  const queryClient = useQueryClient();
  
  console.log('🔍 Page rendered. User:', user);
  console.log('🔍 Auth loading:', authLoading);

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['riderApplications', 'pending'],
    queryFn: async () => {
      
      const result = await getAllRiderApplications('pending');
    
      return result;
    },
    enabled: !!user && !authLoading, // ✅ Only run if user is loaded
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf5]">
        <span className="loading loading-spinner loading-lg text-[#4d8d41]"></span>
      </div>
    );
  }



  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-[#f7fbf5]">

        
        <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <MdHourglassEmpty className="size-8 text-amber-600" />
              <h1 className="text-3xl font-bold text-[#1f2a1d]">Pending Rider Applications</h1>
            </div>

            {applications?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#dce8d8]">
                <p className="text-[#596257]">No pending applications found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {applications?.map((app) => (
                  <div key={app._id} className="bg-white rounded-xl p-6 border border-[#dce8d8] shadow-sm">
                    <div>
                      <h3 className="font-bold text-lg text-[#1f2a1d]">{app.name}</h3>
                      <p className="text-sm text-[#596257]">{app.email}</p>
                      <p className="text-sm text-[#596257]">{app.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}