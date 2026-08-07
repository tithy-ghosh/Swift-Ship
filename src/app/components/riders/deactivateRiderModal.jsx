import React from 'react'
import { MdClose } from 'react-icons/md';

function DeactivateRiderModal() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1f2a1d]">Deactivate Rider</h3>
              <button 
                onClick={() => { setSelectedRider(null); setDeactivateReason(''); }}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <MdClose className="size-5" />
              </button>
            </div>
            
            <p className="text-sm text-[#596257] mb-4">
              Are you sure you want to deactivate <strong>{selectedRider.name}</strong>? 
              They will no longer be able to accept deliveries.
            </p>
            
            <textarea
              className="textarea textarea-bordered w-full mb-4 focus:border-red-500 focus:outline-none"
              rows="3"
              placeholder="Reason for deactivation (e.g., Policy violation, Inactivity...)"
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => { setSelectedRider(null); setDeactivateReason(''); }} 
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button 
                onClick={() => deactivateMutation.mutate({ id: selectedRider._id, reason: deactivateReason })}
                disabled={deactivateMutation.isPending || !deactivateReason.trim()}
                className="btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deactivateMutation.isPending ? 'Deactivating...' : 'Confirm Deactivate'}
              </button>
            </div>
          </div>
        </div>
  )
}

export default DeactivateRiderModal
