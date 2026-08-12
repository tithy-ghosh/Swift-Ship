'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaMoneyBill, FaUsers } from 'react-icons/fa'
import { MdLocalShipping, MdSpaceDashboard, MdDirectionsBike, MdPeople, MdSettings, MdTrackChanges } from 'react-icons/md'
import { TbTruckDelivery } from 'react-icons/tb'
import useAdmin from '@/app/hooks/useAdmin'

// Regular user navigation
const USER_NAVIGATION_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: MdSpaceDashboard },
  { href: '/send-parcel', label: 'Send a Parcel', icon: MdLocalShipping },
  { href: '/track', label: 'Track a Parcel', icon: TbTruckDelivery },
  { href: '/dashboard/payment-history', label: 'Payment History', icon: FaMoneyBill },
  { href: '/be-a-rider', label: 'Be a Rider', icon: MdDirectionsBike },
]

// Admin navigation (completely different)
const ADMIN_NAVIGATION_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: MdSpaceDashboard },
  { href: '/admin/users', label: 'All Users', icon: FaUsers },
  { href: '/admin/parcels', label: 'All Parcels', icon: MdLocalShipping },
  { href: '/admin/payments', label: 'All Payments', icon: FaMoneyBill },
  { href: '/admin/pending-riders', label: 'Pending Riders', icon: MdPeople },
  { href: '/admin/active-riders', label: 'Active Riders', icon: MdDirectionsBike },
  { href: '/admin/settings', label: 'Settings', icon: MdSettings },
]

const SideBar = ({ onNavigate }) => {
  const pathname = usePathname()
  const { isAdmin } = useAdmin()

  const navItems = isAdmin ? ADMIN_NAVIGATION_ITEMS : USER_NAVIGATION_ITEMS

  return (
    <aside className="flex h-full w-full flex-col rounded-xl border border-[#e8f0e5] bg-white px-4 pb-6 pt-16 shadow-sm lg:pt-6">
      <div className="mb-6 px-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#4d8d41]">
          {isAdmin ? 'Admin Panel' : 'Workspace'}
        </p>
        <p className="mt-1 text-lg font-bold text-[#1f2a1d]">
          {isAdmin ? 'SwiftShip Admin' : 'Parcel Dashboard'}
        </p>
      </div>

      <nav aria-label="Dashboard">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`))
            
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-[#eef7eb] text-[#4d8d41]' : 'text-[#596257] hover:bg-[#c2fda5] hover:text-[#1f2a1d]'
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

export default SideBar