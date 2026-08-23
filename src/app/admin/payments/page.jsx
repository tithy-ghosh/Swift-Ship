'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllPayments } from '@/features/payments/api/adminPaymentApi';
import AdminRoute from '@/app/components/admin/AdminRoute';

import { 
  MdPayment, 
  MdWarning, 
  MdCheckCircle, 
  MdHourglassEmpty,
  MdLocalShipping,
  MdPerson,
  MdAccountBalance
} from 'react-icons/md';

export default function AllPaymentsPage() {
  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['allPayments'],
    queryFn: getAllPayments,
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-amber-100 text-amber-700', icon: MdHourglassEmpty, label: 'Pending' },
      paid: { color: 'bg-green-100 text-green-700', icon: MdCheckCircle, label: 'Paid' },
      failed: { color: 'bg-red-100 text-red-700', icon: MdWarning, label: 'Failed' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`badge ${badge.color} gap-1 font-semibold`}>
        <badge.icon className="size-3" /> {badge.label}
      </span>
    );
  };

  const getMethodBadge = (method) => {
    const badges = {
      cod: { color: 'bg-blue-100 text-blue-700', label: 'Cash on Delivery' },
      online: { color: 'bg-purple-100 text-purple-700', label: 'Online' },
    };
    const badge = badges[method] || { color: 'bg-gray-100 text-gray-700', label: method };
    return (
      <span className={`badge ${badge.color} gap-1 font-semibold`}>
        {badge.label}
      </span>
    );
  };

  // Calculate total revenue from paid payments
  const totalRevenue = payments
    ?.filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  const pendingCount = payments?.filter(p => p.status === 'pending').length || 0;
  const paidCount = payments?.filter(p => p.status === 'paid').length || 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf5]">
        <span className="loading loading-spinner loading-lg text-[#4d8d41]"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf5] p-8">
        <div className="text-center">
          <MdWarning className="mx-auto size-16 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-[#1f2a1d]">Error Loading Payments</h2>
          <p className="mt-2 text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-[#f7fbf5]">
       
        <main className="flex-1  overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header with Stats */}
            <div className="flex flex-col gap-2">
              <div className='flex items-center justify-center  mx-auto rounded-full px-6 py-0.5 bg-[#D9EFBD]'>
                <p className="text-sm font-bold text-[#1f2a1d] mb-2 tracking-[0.2em]">All Payments</p>
               
              </div>
               <p className="text-[#596257] text-xl text-center tracking-wider mb-6 font-sans">Monitor all transactions and revenue</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-[#dce8d8] flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <MdCheckCircle className="size-6 text-green-600" />
                </div> 
                <div>
                  <p className="text-sm text-[#596257]">Paid</p>
                  <p className="text-2xl font-bold text-[#1f2a1d]">{paidCount}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#dce8d8] flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
                  <MdHourglassEmpty className="size-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-[#596257]">Pending</p>
                  <p className="text-2xl font-bold text-[#1f2a1d]">{pendingCount}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#dce8d8] flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <MdPayment className="size-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-[#596257]">Total Transactions</p>
                  <p className="text-2xl font-bold text-[#1f2a1d]">{payments?.length || 0}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#dce8d8] flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
                  <MdAccountBalance className='size-6'/>
                </div>
                <div>
                  <p className="text-sm text-[#596257]">Total Revenue</p>
                  <p className="text-2xl font-bold text-[#1f2a1d]">{totalRevenue || '0'}</p>
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl border border-[#dce8d8] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead className="bg-[#edf7ea] text-[#1f2a1d]">
                    <tr>
                      <th>Transaction ID</th>
                      <th>Tracking ID</th>
                      <th>Sender</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments?.length > 0 ? (
                      payments.map((payment) => (
                        <tr key={payment._id}>
                          <td className="font-mono text-xs text-slate-600">
                            {payment._id.slice(-8)}
                          </td>
                          <td className="font-mono font-bold text-[#4d8d41] text-sm">
                            {payment.trackingId || payment.parcelDetails?.trackingId || 'N/A'}
                          </td>
                          <td>
                            <div className="font-bold text-sm">
                              {payment.parcelDetails?.senderName || 'N/A'}
                            </div>
                            <div className="text-xs text-slate-500">
                              {payment.parcelDetails?.createdBy?.email || ''}
                            </div>
                          </td>
                          <td className="font-bold text-[#1f2a1d]">
                            ৳{payment.amount || 0}
                          </td>
                          <td>{getMethodBadge(payment.method)}</td>
                          <td>{getStatusBadge(payment.status)}</td>
                          <td className="text-sm">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-[#596257]">
                          No payments found in the system.
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