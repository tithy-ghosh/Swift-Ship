'use client'

import { useState } from 'react'
import { MdMenu, MdClose } from 'react-icons/md'
import PrivateRoute from '@/app/routes/PrivateRoute'
import DashboardSideBar from '@/app/ui/DashboardSideBar'

export default function PrivateLayout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-[#f7fbf5] lg:flex lg:items-start">
        
        <div className="hidden lg:sticky lg:top-28 lg:block lg:h-[calc(100vh-7rem)] lg:w-64 lg:shrink-0 ">
          <DashboardSideBar />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed left-4 top-24 z-30 flex size-10 items-center justify-center rounded-full bg-white shadow-md lg:hidden"
        >
          <MdMenu className="size-5 text-[#1f2a1d]" />
        </button>

        {/* Mobile sidebar overlay */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 pt-4">
              <div className="relative h-full">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-[#f7fbf5]"
                >
                  <MdClose className="size-4 text-[#1f2a1d]" />
                </button>
                <DashboardSideBar onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <div className="min-w-0 flex-1  pt-28">{children}</div>
      </div>
    </PrivateRoute>
  )
}