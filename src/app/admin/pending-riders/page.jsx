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
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-surface-muted">
        <span className="loading loading-spinner loading-lg text-brand-accent"></span>
        <p className="text-sm text-brand-content-muted">Loading pending applications…</p>
      </div>
    );
  }

  

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-brand-surface-muted">     
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-4 mb-2 mx-auto justify-center items-center">
              <div className="flex items-center gap-3 bg-brand-accent-pale px-6 py-1 rounded-full">
               
                <p className="text-sm font-bold text-brand-surface-admin tracking-[0.2em]">Pending Rider Applications</p>
              </div>
              
            </div>
            <p className="text-2xl text-brand-content-muted mb-8 mx-auto flex justify-center items-center text-center tracking-wider font-sans">
            Approve qualified candidates to join the fleet or reject those who don't meet our standards.
            </p>

            {applications?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-brand-border-subtle">
                <MdHourglassEmpty className="mx-auto size-16 text-slate-300" />
                <p className="mt-4 text-brand-content-muted">No pending applications found.</p>
                <p className="text-sm text-slate-400 mt-1">New rider applications will show up here.</p>
              </div>
            ) : (
              <div className="grid gap-5">
                {applications?.map((app) => (
                  <div key={app._id} className="bg-white rounded-2xl p-6 border border-brand-border-subtle shadow-sm hover:shadow-md hover:border-brand-border-moss transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <MdPerson className="size-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-brand-content leading-tight">{app.name}</h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-xs font-semibold text-amber-700">
                          Pending Review
                        </span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column: Personal Info */}
                      <div className="space-y-3">
                        <p className="text-sm text-brand-content-muted flex items-center gap-2">
                          <MdEmail className="text-slate-400 shrink-0" /> {app.email}
                        </p>
                        <p className="text-sm text-brand-content-muted flex items-center gap-2">
                          <MdPhone className="text-slate-400 shrink-0" /> {app.phone}
                        </p>
                        <p className="text-sm text-brand-content-muted">
                          <span className="font-semibold text-brand-content">Age:</span> {app.age} | 
                          <span className="font-semibold text-brand-content ml-2">Exp:</span> {app.experience} yrs
                        </p>
                      </div>

                      {/* Right Column: Location & Bike Info */}
                      <div className="space-y-3 md:border-l md:border-brand-border-subtle md:pl-6">
                        <p className="text-sm text-brand-content-muted flex items-center gap-2">
                          <MdLocationOn className="text-slate-400 shrink-0" /> {app.district}, {app.region}
                        </p>
                        <p className="text-sm text-brand-content-muted flex items-center gap-2">
                          <MdOutlineDirectionsBike className="text-slate-400 shrink-0" /> {app.bikeBrand} ({app.bikeRegNumber})
                        </p>
                        <p className="text-sm text-brand-content-muted">
                          <span className="font-semibold text-brand-content">NID:</span> {app.nid}
                        </p>
                        <p className="text-sm text-brand-content-muted">
                          <span className="font-semibold text-brand-content">License:</span> {app.licenseNumber}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-brand-border-subtle">
                      <button
                        onClick={() => approveMutation.mutate(app._id)}
                        disabled={approveMutation.isPending}
                        className="btn btn-sm bg-brand-accent-bright text-brand-surface-inverse-deep hover:bg-brand-accent-hover disabled:opacity-50 shadow-sm"
                      >
                        <MdCheckCircle className="size-4" /> Approve
                      </button>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn btn-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-brand-border-subtle">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <MdClose className="size-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-brand-content">Reject Application</h3>
            </div>
            <p className="text-sm text-brand-content-muted mb-4 leading-relaxed">
              Please provide a reason for rejecting <strong className="text-brand-content">{selectedApp.name}</strong>.
            </p>
            
            <textarea
              className="textarea textarea-bordered w-full mb-4 focus:border-red-400 focus:outline-none rounded-lg"
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