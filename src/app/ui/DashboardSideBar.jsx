'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MdLocalShipping, MdSpaceDashboard } from 'react-icons/md'
import { TbTruckDelivery } from 'react-icons/tb'

const NAVIGATION_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: MdSpaceDashboard },
  { href: '/send-parcel', label: 'Send a Parcel', icon: MdLocalShipping },
  { href: '/track', label: 'Track a Parcel', icon: TbTruckDelivery },
]

/**
 * Shared dashboard navigation used by both the desktop rail and mobile drawer.
 */
const DashboardSideBar = ({ onNavigate }) => {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-full flex-col rounded-xl border border-[#e8f0e5] bg-white px-4 pb-6 pt-16 shadow-sm lg:pt-6">
      <div className="mb-6 px-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4d8d41]">
          Workspace
        </p>
        <p className="mt-1 text-lg font-bold text-[#1f2a1d]">Parcel Dashboard</p>
      </div>

      <nav aria-label="Dashboard">
        <ul className="space-y-1">
          {NAVIGATION_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#eef7eb] text-[#4d8d41]'
                      : 'text-[#596257] hover:bg-[#c2fda5] hover:text-[#1f2a1d]'
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default DashboardSideBar
