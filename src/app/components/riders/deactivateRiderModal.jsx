import React from 'react'
import { MdBlock, MdClose } from 'react-icons/md';

function DeactivateRiderModal({
  rider,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  isPending,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[#e8f0e5]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <MdBlock className="size-5 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-[#1f2a1d]">Deactivate Rider</h3>
              </div>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm btn-circle -mt-1 -mr-1"
              >
                <MdClose className="size-5" />
              </button>
            </div>

            <p className="text-sm text-[#596257] mb-4 leading-relaxed">
              Are you sure you want to deactivate <strong className="text-[#1f2a1d]">{rider.name}</strong>?
              They will no longer be able to accept deliveries.
            </p>

            <textarea
              className="textarea textarea-bordered w-full mb-4 focus:border-red-400 focus:outline-none rounded-lg"
              rows="3"
              placeholder="Reason for deactivation (e.g., Policy violation, Inactivity...)"
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isPending || !reason.trim()}
                className="btn bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 shadow-sm"
              >
                {isPending ? 'Deactivating...' : 'Confirm Deactivate'}
              </button>
            </div>
          </div>
        </div>
  )
}

export default DeactivateRiderModal