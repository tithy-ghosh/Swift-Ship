'use client'

import { useEffect, useState } from 'react'
import { MdClose, MdMenu } from 'react-icons/md'
import DashboardSideBar from '@/app/ui/DashboardSideBar'

/**
 * Provides the responsive navigation shell shared by dashboard routes.
 *
 * Authentication is intentionally handled by the parent `(private)` layout,
 * preventing nested guards and duplicate full-screen loading states.
 */
export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Escape should behave like the backdrop and close the temporary mobile drawer.
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMobileMenuOpen])

  return (
    <div className="min-h-screen bg-[#f7fbf5]">
      <div className="mx-auto flex w-full max-w-7xl items-start">
        {/* Desktop navigation remains visible while the page content scrolls. */}
        <div className="sticky top-20 hidden h-[calc(100dvh-2rem)] w-64 shrink-0 py-4 pl-4 lg:block">
          <DashboardSideBar />
        </div>

        <div className="min-w-0 flex-1">
          <div className="px-4 pt-4 lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dce8d8] bg-white px-3 text-sm font-semibold text-[#31542b] shadow-sm"
              aria-controls="dashboard-mobile-navigation"
              aria-expanded={isMobileMenuOpen}
            >
              <MdMenu className="size-5" />
              Dashboard menu
            </button>
          </div>

          <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="dashboard-mobile-navigation"
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard navigation"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/45"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close dashboard navigation"
          />

          <div className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] p-3">
            <div className="relative h-full">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-[#eef7eb] text-[#31542b]"
                aria-label="Close dashboard menu"
              >
                <MdClose className="size-5" />
              </button>
              <DashboardSideBar onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
