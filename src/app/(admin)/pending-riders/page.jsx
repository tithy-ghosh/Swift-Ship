'use client';

import AdminRoute from "@/app/components/admin/AdminRoute";
import SideBar from "@/app/ui/SideBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { MdCheckCircle, MdClose, MdHourglassEmpty } from "react-icons/md";


export default function PendingRiderPage(){
    const queryClient = useQueryClient();
    const [selectedApp, setSelectedApp] = useState(null);
    const { data: applications, isLoading } = useQuery({
    queryKey: ['riderApplications', 'pending'],
    queryFn: () => getAllRiderApplications('pending'),
    })
    const approveMutation = useMutation({
    mutationFn: ({ id }) => approveRiderApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['riderApplications']);
      setSelectedApp(null);
    },
    })
    const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectRiderApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['riderApplications']);
      setSelectedApp(null);
    },
  });
    if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
    return (
    <AdminRoute>
      <div className="min-h-screen bg-[#f7fbf5]">
    
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <MdHourglassEmpty className="size-8 text-amber-600" />
              <h1 className="text-3xl font-bold text-[#1f2a1d]">Pending Rider Applications</h1>
            </div>

            {applications?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-[#dce8d8]">
                <p className="text-[#596257]">No pending applications</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {applications?.map((app) => (
                  <div key={app._id} className="bg-white rounded-xl p-6 border border-[#dce8d8] shadow-sm">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-[#1f2a1d]">{app.name}</h3>
                        <p className="text-sm text-[#596257]">{app.email}</p>
                        <p className="text-sm text-[#596257]">{app.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm"><span className="font-semibold">Region:</span> {app.region}</p>
                        <p className="text-sm"><span className="font-semibold">District:</span> {app.district}</p>
                        <p className="text-sm"><span className="font-semibold">Bike:</span> {app.bikeBrand} ({app.bikeRegNumber})</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-4 pt-4 border-t border-[#e8f0e5]">
                      <button
                        onClick={() => approveMutation.mutate({ id: app._id })}
                        className="btn btn-sm bg-[#83BD75] text-[#172015] hover:bg-[#74ad68]"
                      >
                        <MdCheckCircle className="size-4" /> Approve
                      </button>
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        < MdClose className="size-4" /> Reject
                      </button>
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