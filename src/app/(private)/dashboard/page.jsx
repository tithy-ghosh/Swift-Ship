'use client'

import useAuth from "@/app/hooks/useAuth"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MdDeleteOutline } from "react-icons/md"

const API_URI = process.env.NEXT_PUBLIC_API_URL

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-blue-100 text-blue-700',
  'picked-up': 'bg-purple-100 text-purple-700',
  'in-transit': 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const fetchMyParcels = async (user) => {
  const token = await user.getIdToken()
  const res = await fetch(`${API_URI}/api/parcels/my`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch parcels')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

const deleteParcel = async ({ user, parcelId }) => {
  const token = await user.getIdToken()
  const res = await fetch(`${API_URI}/api/parcels/${parcelId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Failed to delete parcel')
  }
  return res.json()
}

const DashboardPage = () => {

  const { user } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: parcels = [],
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ['parcels', 'my', user?.uid],
    queryFn: () => fetchMyParcels(user),
    enabled: !!user,
  })

  const deleteMutation = useMutation({
    mutationFn: (parcelId) => deleteParcel({ user, parcelId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels', 'my', user?.uid] })
    },
  })

  const handleDelete = (parcel) => {
    const confirmed = window.confirm(
      `Delete parcel ${parcel.trackingId}? This can't be undone.`
    )
    if (!confirmed) return
    deleteMutation.mutate(parcel._id)
  }

  const error = isError ? 'Could not load your parcels. Please try again!' : null

  const statsData = [
    { label: 'Total', value: parcels.length, color: 'bg-white' },
    { label: 'Pending', value: parcels.filter(p => p.status === 'pending').length, color: 'bg-yellow-50' },
    { label: 'In Transit', value: parcels.filter(p => p.status === 'in-transit').length, color: 'bg-orange-50' },
    { label: 'Delivered', value: parcels.filter(p => p.status === 'delivered').length, color: 'bg-green-50' },
  ]

  return (
    <main className="min-h-screen bg-[#f7fbf5] px-5  text-[#1f2a1d]">
      <section className="mx-auto max-w-5xl space-y-8 ">
        {/* Header */}
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4d8d41]">
            My Parcels
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">Welcome, {user?.displayName || 'there'}</h1>
           <p className="text-[#596257]">
            Track and manage all your shipments from here.
          </p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {
            statsData.map((stat)=> (
              <div key={stat.label} className={`${stat.color} rounded-xl border border-[#cbdac7] p-4 text-center shadow-sm`}>
                 <p className="text-2xl font-bold text-[#1f2a1d]">{stat.value}</p>
                 <p className="text-sm text-[#596257]">{stat.label}</p>
              </div>
            ))
          }
        </div>

        {deleteMutation.isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {deleteMutation.error?.message || 'Could not delete parcel. Please try again.'}
          </div>
        )}

        {/* Parcels Table */}
        <div className="rounded-xl border border-[#cbdac7] bg-white shadow-sm">
          <div className="border-b border-[#cbdac7] px-6 py-4">
            <h2 className="font-semibold text-[#1f2a1d]">All Shipments</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#596257]">Loading your parcels.....</div>
          ): error ? (
            <div className="py-16 text-center text-red-500">{error}</div>
          ): parcels.length === 0 ? (
             <div className="py-16 text-center text-[#596257]">
              <p className="text-lg font-medium">No parcels yet</p>
              <p className="mt-1 text-sm">Send your first parcel to see it here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f7fbf5] text-left text-xs font-semibold uppercase tracking-wide text-[#596257]">
                  <tr>
                    <th className="px-6 py-3">Tracking ID</th>
                    <th className="px-6 py-3">Receiver</th>
                    <th className="px-6 py-3">Route</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Cost</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8f0e5]">
                  {parcels.map((parcel) => {
                    const isDeleting = deleteMutation.isPending && deleteMutation.variables === parcel._id
                    return (
                      <tr key={parcel._id} className="hover:bg-[#f7fbf5]">
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-[#4d8d41]">
                          {parcel.trackingId}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{parcel.receiverName}</p>
                          <p className="text-xs text-[#596257]">{parcel.receiverContact}</p>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#596257]">
                          {parcel.senderServiceCenter} → {parcel.receiverServiceCenter}
                        </td>
                        <td className="px-6 py-4 capitalize">{parcel.type}</td>
                        <td className="px-6 py-4 font-semibold">BDT {parcel.deliveryCost}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2 py-1 text-xs font-semibold capitalize ${statusColors[parcel.status] || 'bg-gray-100 text-gray-600'}`}>
                            {parcel.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#596257]">
                          {new Date(parcel.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(parcel)}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <MdDeleteOutline className="size-4" />
                            {isDeleting ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
