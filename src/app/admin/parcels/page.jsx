'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllParcels } from '@/features/parcels/api/adminParcelApi';
import AdminRoute from '@/app/components/admin/AdminRoute';

import { MdLocalShipping, MdWarning, MdCheckCircle, MdHourglassEmpty, MdPerson } from 'react-icons/md';

export default function AllParcelsPage() {
  const { data: parcels, isLoading, error } = useQuery({
    queryKey: ['allParcels'],
    queryFn: getAllParcels,
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-amber-100 text-amber-700', icon: MdHourglassEmpty, label: 'Pending' },
      picked_up: { color: 'bg-blue-100 text-blue-700', icon: MdLocalShipping, label: 'In Transit' },
      delivered: { color: 'bg-green-100 text-green-700', icon: MdCheckCircle, label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: MdWarning, label: 'Cancelled' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`badge ${badge.color} gap-1 font-semibold`}>
        <badge.icon className="size-3" /> {badge.label}
      </span>
    );
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="text-center">
          <MdWarning className="mx-auto size-16 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold">Error Loading Parcels</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-[#f7fbf5]">
       
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className='flex flex-col'>
                <div className='flex items-center justify-center mx-auto px-6 py-0.5 bg-[#D9EFBD] rounded-full'>
                    <p className="text-sm font-bold text-[#1f2a1d] mb-2">All Parcels</p>
                </div>
            <p className="text-[#596257] mb-6 text-xl font-sans tracking-wider text-center">Track and manage all deliveries in the system</p>
            </div>

            <div className="bg-white rounded-xl border border-[#dce8d8] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead className="bg-[#edf7ea] text-[#1f2a1d]">
                    <tr>
                      <th>Tracking ID</th>
                      <th>Sender</th>
                      <th>Receiver</th>
                      <th>Cost</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcels?.length > 0 ? (
                      parcels.map((parcel) => (
                        <tr key={parcel._id}>
                          <td className="font-mono font-bold text-[#4d8d41] text-sm">{parcel.trackingId}</td>
                          <td>
                            <div className="font-bold text-sm">{parcel.senderName || 'N/A'}</div>
                            <div className="text-xs text-slate-500">{parcel.senderContact}</div>
                          </td>
                          <td>
                            <div className="font-bold text-sm">{parcel.receiverName || 'N/A'}</div>
                            <div className="text-xs text-slate-500">{parcel.receiverContact}</div>
                          </td>
                          <td className="font-bold text-[#1f2a1d]">৳{parcel.deliveryCost || 0}</td>
                          <td>{getStatusBadge(parcel.currentStatus || parcel.status)}</td>
                          <td className="text-sm">{new Date(parcel.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-8 text-[#596257]">
                          No parcels found in the system.
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