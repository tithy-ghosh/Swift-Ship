'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllMerchantApplications,
  approveMerchantApplication,
  rejectMerchantApplication,
} from '@/features/merchants/api/adminMerchantApi';
import AdminRoute from '@/app/components/admin/AdminRoute';
import {
  MdCheckCircle,
  MdClose,
  MdEmail,
  MdHourglassEmpty,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdStorefront,
} from 'react-icons/md';
import { TbBuildingStore, TbTruckDelivery } from 'react-icons/tb';

export default function PendingMerchantsPage() {
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['merchantApplications', 'pending'],
    queryFn: () => getAllMerchantApplications('pending'),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approveMerchantApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantApplications'] });
      alert('Merchant approved successfully! Their role has been updated.');
    },
    onError: (err) =>
      alert('Failed to approve: ' + (err.response?.data?.error || err.message)),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectMerchantApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantApplications'] });
      setSelectedApp(null);
      setRejectReason('');
      alert('Application rejected.');
    },
    onError: (err) =>
      alert('Failed to reject: ' + (err.response?.data?.error || err.message)),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-brand-surface-muted">
        <span className="loading loading-spinner loading-lg text-brand-accent" />
        <p className="text-sm text-brand-content-muted">Loading merchant applications…</p>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-brand-surface-muted">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-2 flex items-center justify-center gap-4">
              <div className="flex items-center gap-3 rounded-full bg-brand-accent-pale px-6 py-1">
                <p className="text-sm font-bold tracking-[0.2em] text-brand-surface-admin">
                  Pending Merchant Applications
                </p>
              </div>
            </div>
            <p className="mx-auto mb-8 flex items-center justify-center text-center font-sans text-2xl tracking-wider text-brand-content-muted">
              Approve stores that are ready to ship with SwiftShip, or reject those
              that don&apos;t meet our requirements.
            </p>

            {applications?.length === 0 ? (
              <div className="rounded-2xl border border-brand-border-subtle bg-white p-12 text-center">
                <MdHourglassEmpty className="mx-auto size-16 text-slate-300" />
                <p className="mt-4 text-brand-content-muted">No pending applications found.</p>
                <p className="mt-1 text-sm text-slate-400">
                  New merchant applications will show up here.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {applications?.map((app) => (
                  <div
                    key={app._id}
                    className="rounded-2xl border border-brand-border-subtle bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-border-moss hover:shadow-md"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-50">
                        <MdStorefront className="size-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold leading-tight text-brand-content">
                          {app.businessName || app.name}
                        </h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                          Pending Review
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                        <p className="flex items-center gap-2 text-sm text-brand-content-muted">
                          <MdPerson className="shrink-0 text-slate-400" /> {app.name}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-brand-content-muted">
                          <MdEmail className="shrink-0 text-slate-400" /> {app.email}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-brand-content-muted">
                          <MdPhone className="shrink-0 text-slate-400" /> {app.phone}
                        </p>
                      </div>

                      <div className="space-y-3 md:border-l md:border-brand-border-subtle md:pl-6">
                        <p className="flex items-center gap-2 text-sm text-brand-content-muted">
                          <TbBuildingStore className="shrink-0 text-slate-400" />
                          {app.businessType}
                          {app.monthlyOrders ? ` · ${app.monthlyOrders} orders/mo` : ''}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-brand-content-muted">
                          <MdLocationOn className="shrink-0 text-slate-400" /> {app.district},{' '}
                          {app.region}
                        </p>
                        <p className="flex items-start gap-2 text-sm text-brand-content-muted">
                          <TbTruckDelivery className="mt-0.5 shrink-0 text-slate-400" />
                          <span>{app.pickupAddress}</span>
                        </p>
                        <p className="text-sm text-brand-content-muted">
                          <span className="font-semibold text-brand-content">COD:</span>{' '}
                          {app.needsCOD ? 'Required' : 'Not required'}
                        </p>
                        {app.website && (
                          <p className="truncate text-sm text-brand-content-muted">
                            <span className="font-semibold text-brand-content">Store:</span>{' '}
                            {app.website}
                          </p>
                        )}
                      </div>
                    </div>

                    {app.notes && (
                      <p className="mt-4 rounded-xl bg-brand-surface-muted p-3 text-sm text-brand-content-muted">
                        {app.notes}
                      </p>
                    )}

                    <div className="mt-6 flex justify-end gap-3 border-t border-brand-border-subtle pt-4">
                      <button
                        onClick={() => approveMutation.mutate(app._id)}
                        disabled={approveMutation.isPending}
                        className="btn btn-sm bg-brand-accent-bright text-brand-surface-inverse-deep shadow-sm hover:bg-brand-accent-hover disabled:opacity-50"
                      >
                        <MdCheckCircle className="size-4" /> Approve
                      </button>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn btn-sm border border-red-200 bg-red-50 text-red-600 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white"
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

      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-brand-border-subtle bg-white p-6 shadow-2xl">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                <MdClose className="size-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-brand-content">Reject Application</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-brand-content-muted">
              Please provide a reason for rejecting{' '}
              <strong className="text-brand-content">
                {selectedApp.businessName || selectedApp.name}
              </strong>
              .
            </p>

            <textarea
              rows="3"
              className="textarea textarea-bordered mb-4 w-full rounded-lg focus:border-red-400 focus:outline-none"
              placeholder="e.g., Out of service area, incomplete business details…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedApp(null);
                  setRejectReason('');
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  rejectMutation.mutate({ id: selectedApp._id, reason: rejectReason })
                }
                disabled={rejectMutation.isPending || !rejectReason.trim()}
                className="btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting…' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminRoute>
  );
}
