'use client'

import { useEffect } from 'react'
import { MdCheckCircle, MdClose, MdErrorOutline } from 'react-icons/md'

/**
 * Fixed top-right toast. Auto-dismisses after `duration` ms.
 *
 * @param {{
 *   type: 'success' | 'error',
 *   message: string,
 *   onDismiss: () => void,
 *   duration?: number,
 * }} props
 */
export default function Toast({ type = 'success', message, onDismiss, duration = 3500 }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  const isSuccess = type === 'success'

  return (
    <div className="fixed top-20 right-4 z-[60] max-w-sm animate-[fadeIn_0.2s_ease-out]">
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm ${
          isSuccess ? 'bg-[#edf7ea] border-[#c3e6b8]' : 'bg-red-50 border-red-200'
        }`}
      >
        {isSuccess ? (
          <MdCheckCircle className="size-5 text-[#4d8d41] shrink-0 mt-0.5" />
        ) : (
          <MdErrorOutline className="size-5 text-red-500 shrink-0 mt-0.5" />
        )}
        <p className={`text-sm font-medium flex-1 ${isSuccess ? 'text-[#1f2a1d]' : 'text-red-700'}`}>{message}</p>
        <button onClick={onDismiss} className="shrink-0 text-slate-400 hover:text-slate-600" aria-label="Dismiss">
          <MdClose className="size-4" />
        </button>
      </div>
    </div>
  )
}