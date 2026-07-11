'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MdSpaceDashboard, MdLocalShipping,  MdLogout } from 'react-icons/md'
import useAuth from '@/app/hooks/useAuth'

const navLinks = [
  { href: '/dashboard', label: 'Overview', icon: MdSpaceDashboard },
  { href: '/send-parcel', label: 'Send a Parcel', icon: MdLocalShipping },

]

const DashboardSideBar = ({ onNavigate }) => {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-[#e8f0e5] bg-white px-4 pb-6">
      <div>
        <nav>
          <ul className="space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#eef7eb] text-[#4d8d41]'
                        : 'text-[#596257] hover:bg-[#f7fbf5] hover:text-[#1f2a1d]'
                    }`}
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      
    </aside>
  )
}

export default DashboardSideBar