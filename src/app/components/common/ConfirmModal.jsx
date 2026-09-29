import React from 'react'
import { MdClose, MdWarning } from 'react-icons/md'

/**
 * Generic confirm dialog. Mirrors the visual language of
 * `deactivateRiderModal.jsx` so destructive actions look consistent
 * across the admin area.
 */
function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger', // 'danger' | 'default'
  onClose,
  onConfirm,
  isPending = false,
}) {
  const toneClasses =
    tone === 'danger'
      ? {
          iconWrap: 'bg-red-50 text-red-500',
          confirmBtn: 'bg-red-500 text-white hover:bg-red-600',
        }
      : {
          iconWrap: 'bg-brand-surface-sunken text-brand-accent',
          confirmBtn: 'bg-brand-accent-bright text-brand-surface-inverse-deep hover:bg-brand-accent-hover',
        }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-brand-border-subtle">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${toneClasses.iconWrap}`}>
              <MdWarning className="size-5" />
            </div>
            <h3 className="text-xl font-bold text-brand-content">{title}</h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle -mt-1 -mr-1" aria-label="Close">
            <MdClose className="size-5" />
          </button>
        </div>

        <p className="text-sm text-brand-content-muted mb-6 leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost" disabled={isPending}>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`btn disabled:opacity-50 shadow-sm ${toneClasses.confirmBtn}`}
          >
            {isPending ? <span className="loading loading-spinner loading-sm" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal