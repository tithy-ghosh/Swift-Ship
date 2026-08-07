'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllRiderApplications, 
  deactivateRiderApplication 
} from '@/features/riders/api/adminRiderApi';
import AdminRoute from '@/app/components/admin/AdminRoute';
import { MdBlock, MdCheckCircle, MdClose, MdEmail, MdLocationOn, MdPerson, MdPhone, MdVerified } from 'react-icons/md';
import { TbBikeFilled } from 'react-icons/tb';
import DeactivateRiderModal from '@/app/components/riders/deactivateRiderModal';



export default function ActiveRidersPage() {
  const queryClient = useQueryClient();
  const [selectedRider, setSelectedRider] = useState(null);
  const [deactivateReason, setDeactivateReason] = useState('');

  const { data: riders, isLoading, error } = useQuery({
    queryKey: ['riderApplications', 'approved'],
    queryFn: () => getAllRiderApplications('approved'),
  });

  // Deactivate Mutation
  const deactivateMutation = useMutation({
    mutationFn: ({ id, reason }) => deactivateRiderApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riderApplications'] });
      setSelectedRider(null);
      setDeactivateReason('');
      alert('Rider deactivated successfully.');
    },
    onError: (err) => alert('Failed to deactivate: ' + (err.response?.data?.error || err.message)),
  });

  if (isLoading) {
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
            {/* Header with Stats */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MdVerified className="size-8 text-[#4d8d41]" />
                <h1 className="text-3xl font-bold text-[#1f2a1d]">Active Riders</h1>
              </div>
              <div className="bg-[#edf7ea] px-4 py-2 rounded-lg">
                <p className="text-sm text-[#596257]">Total Active</p>
                <p className="text-2xl font-bold text-[#4d8d41]">{riders?.length || 0}</p>
              </div>
            </div>

            {riders?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#dce8d8]">
                <MdCheckCircle className="mx-auto size-16 text-slate-300" />
                <p className="mt-4 text-[#596257]">No active riders yet.</p>
                <p className="text-sm text-slate-400 mt-1">Approved riders will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {riders?.map((rider) => (
                  <div 
                    key={rider._id} 
                    className="bg-white rounded-xl p-6 border border-[#dce8d8] shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Rider Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#edf7ea] flex items-center justify-center">
                          <MdPerson className="size-6 text-[#4d8d41]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1f2a1d]">{rider.name}</h3>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#edf7ea] text-xs font-semibold text-[#4d8d41]">
                            <MdVerified className="size-3" /> Verified Rider
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-[#e8f0e5]">
                      <p className="text-sm text-[#596257] flex items-center gap-2">
                        <MdEmail className="text-slate-400 shrink-0" /> 
                        <span className="truncate">{rider.email}</span>
                      </p>
                      <p className="text-sm text-[#596257] flex items-center gap-2">
                        <MdPhone className="text-slate-400 shrink-0" /> {rider.phone}
                      </p>
                      <p className="text-sm text-[#596257] flex items-center gap-2">
                        <MdLocationOn className="text-slate-400 shrink-0" /> {rider.district}, {rider.region}
                      </p>
                    </div>

                    {/* Bike & License Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Bike</span>
                        <span className="font-medium text-[#1f2a1d] flex items-center gap-1">
                          <TbBikeFilled className="text-[#4d8d41]" /> {rider.bikeBrand}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Reg No.</span>
                        <span className="font-medium text-[#1f2a1d]">{rider.bikeRegNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">License</span>
                        <span className="font-medium text-[#1f2a1d]">{rider.licenseNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Experience</span>
                        <span className="font-medium text-[#1f2a1d]">{rider.experience} yrs</span>
                      </div>
                    </div>

                    {/* Deactivate Button */}
                    <button
                      onClick={() => setSelectedRider(rider)}
                      className="btn btn-sm w-full bg-red-500 text-white hover:bg-red-600 mt-2"
                    >
                      <MdBlock className="size-4" /> Deactivate Rider
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Deactivation Modal */}
      {selectedRider && (
        <DeactivateRiderModal />
      )}
    </AdminRoute>
  );
}