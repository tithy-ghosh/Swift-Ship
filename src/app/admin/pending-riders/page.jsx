'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAllRiderApplications, 
  approveRiderApplication, 
  rejectRiderApplication 
} from '@/features/riders/api/adminRiderApi';
import AdminRoute from '@/app/components/admin/AdminRoute';
import { MdCheckCircle, MdClose, MdEmail, MdHourglassEmpty, MdLocationOn, MdOutlineDirectionsBike, MdPerson, MdPhone } from 'react-icons/md';


export default function PendingRidersPage() {
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // 1. Fetch Pending Applications
  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['riderApplications', 'pending'],
    queryFn: () => getAllRiderApplications('pending'),
  });

  // 2. Approve Mutation
  const approveMutation = useMutation({
    mutationFn: (id) => approveRiderApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riderApplications'] });
      alert('Rider approved successfully! Their role has been updated.');
    },
    onError: (err) => alert('Failed to approve: ' + (err.response?.data?.error || err.message)),
  });

  // 3. Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectRiderApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riderApplications'] });
      setSelectedApp(null);
      setRejectReason('');
      alert('Application rejected.');
    },
    onError: (err) => alert('Failed to reject: ' + (err.response?.data?.error || err.message)),
  });

  // Loading State
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
                  <div key={app._id} className="bg-white rounded-xl p-6 border border-[#dce8d8] shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column: Personal Info */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg text-[#1f2a1d] flex items-center gap-2">
                          <MdPerson className="text-[#4d8d41]" /> {app.name}
                        </h3>
                        <p className="text-sm text-[#596257] flex items-center gap-2">
                          <MdEmail className="text-slate-400" /> {app.email}
                        </p>
                        <p className="text-sm text-[#596257] flex items-center gap-2">
                          <MdPhone className="text-slate-400" /> {app.phone}
                        </p>
                        <p className="text-sm text-[#596257]">
                          <span className="font-semibold text-[#1f2a1d]">Age:</span> {app.age} | 
                          <span className="font-semibold text-[#1f2a1d] ml-2">Exp:</span> {app.experience} yrs
                        </p>
                      </div>

                      {/* Right Column: Location & Bike Info */}
                      <div className="space-y-3">
                        <p className="text-sm text-[#596257] flex items-center gap-2">
                          <MdLocationOn className="text-slate-400" /> {app.district}, {app.region}
                        </p>
                        <p className="text-sm text-[#596257] flex items-center gap-2">
                          <MdOutlineDirectionsBike className="text-slate-400" /> {app.bikeBrand} ({app.bikeRegNumber})
                        </p>
                        <p className="text-sm text-[#596257]">
                          <span className="font-semibold text-[#1f2a1d]">NID:</span> {app.nid}
                        </p>
                        <p className="text-sm text-[#596257]">
                          <span className="font-semibold text-[#1f2a1d]">License:</span> {app.licenseNumber}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#e8f0e5]">
                      <button
                        onClick={() => approveMutation.mutate(app._id)}
                        disabled={approveMutation.isPending}
                        className="btn btn-sm bg-[#83BD75] text-[#172015] hover:bg-[#74ad68] disabled:opacity-50"
                      >
                        <MdCheckCircle className="size-4" /> Approve
                      </button>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        <MdClose className="size-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Reject Reason Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-[#1f2a1d] mb-2">Reject Application</h3>
            <p className="text-sm text-[#596257] mb-4">
              Please provide a reason for rejecting <strong>{selectedApp.name}</strong>.
            </p>
            
            <textarea
              className="textarea textarea-bordered w-full mb-4 focus:border-[#83BD75] focus:outline-none"
              rows="3"
              placeholder="e.g., Invalid license number, incomplete information..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setSelectedApp(null); setRejectReason(''); }} 
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button 
                onClick={() => rejectMutation.mutate({ id: selectedApp._id, reason: rejectReason })}
                disabled={rejectMutation.isPending || !rejectReason.trim()}
                className="btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminRoute>
  );
}