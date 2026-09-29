'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import {
  MdDashboard,
  MdLocalShipping,
  MdLogout,
  MdMap,
  MdMenu,
  MdNotifications,
  MdPerson,
  MdSearch,
  MdSettings,
  MdSupportAgent,
} from 'react-icons/md'
import { TbRoute } from 'react-icons/tb'

import Logo from '@/app/components/logo'
import useAuth from '@/app/hooks/useAuth'
import { getUserProfile } from '@/features/users/api/userApi'
import ProfileModal from '@/app/components/profile/ProfileModal'
import { getProfileImageSource, getProfilePhoto } from '@/app/utils/profileImage'

const ROLE_LABELS = {
  admin: 'Admin',
  rider: 'Rider',
  customer: 'Customer',
}

const ROLE_BADGE_CLASSES = {
  admin: 'bg-brand-surface-sunken text-brand-accent',
  rider: 'bg-amber-50 text-amber-600',
  customer: 'bg-slate-100 text-slate-500',
}

const NAV_ICONS = {
  '/': TbRoute,
  '/about': MdSupportAgent,
  '/coverage': MdMap,
  '/be-rider': MdLocalShipping,
  '/dashboard': MdDashboard,
  '/admin/dashboard': MdDashboard,
}

/**
 * Builds the primary nav links for the given role. `role` is `undefined`
 * while logged out or while the profile is still loading.
 */
const getNavLinks = (role) => {
  const base = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/coverage', label: 'Coverage' },
  ]

  // Logged out: keep the rider CTA visible to attract sign-ups.
  if (!role) {
    return [...base, { href: '/be-rider', label: 'Become a Rider' }]
  }

  if (role === 'admin') {
    return [...base, { href: '/admin/dashboard', label: 'Dashboard' }]
  }

  if (role === 'rider') {
    return [...base, { href: '/dashboard', label: 'Dashboard' }]
  }

  // Customer
  return [...base, { href: '/dashboard', label: 'Dashboard' }, { href: '/be-rider', label: 'Become a Rider' }]
}

const isLinkActive = (pathname, href) => (
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)
)

const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logOut } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [failedAvatarSource, setFailedAvatarSource] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [trackingId, setTrackingId] = useState('')
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const navListRef = useRef(null)
  const searchInputRef = useRef(null)

  // Fetch profile data for the navbar avatar/name/role
  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: !!user, // Only fetch if user is logged in
  })

  const role = user ? profile?.role : undefined
  const navLinks = getNavLinks(role)
  const avatarSource = getProfileImageSource(getProfilePhoto(profile)) || user?.photoURL || ''

  const activeHref = navLinks.find((link) => isLinkActive(pathname, link.href))?.href

  // Keep the active pill highlight aligned with the rendered link.
  useLayoutEffect(() => {
    const list = navListRef.current
    if (!list) return

    const syncPill = () => {
      const activeLink = list.querySelector('[data-nav-href][aria-current="page"]')
      const pill = list.querySelector('[data-pill]')

      if (!activeLink || !pill) {
        pill?.setAttribute('data-visible', 'false')
        return
      }

      pill.style.width = `${activeLink.offsetWidth}px`
      pill.style.transform = `translateX(${activeLink.offsetLeft}px)`
      pill.setAttribute('data-visible', 'true')
    }

    syncPill()

    const resizeObserver = new ResizeObserver(syncPill)
    resizeObserver.observe(list)
    if (list.firstElementChild) resizeObserver.observe(list.firstElementChild)

    return () => resizeObserver.disconnect()
  }, [activeHref, navLinks.length, role])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMobileMenuOpen])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const openSearch = useCallback(() => {
    setIsSearchOpen(true)
    window.requestAnimationFrame(() => searchInputRef.current?.focus())
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
        setIsNotificationsOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleLogout = () => {
    closeMobileMenu()
    logOut()
      .then(() => {
        router.push('/login')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleTrackingSubmit = (event) => {
    event.preventDefault()
    const value = trackingId.trim()

    if (!value) return

    setIsSearchOpen(false)
    setTrackingId('')
    router.push(`/track/${encodeURIComponent(value)}`)
  }

  const renderAvatar = () => (
    <div className="relative size-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white transition group-hover:ring-brand-accent/50">
      {avatarSource && avatarSource !== failedAvatarSource ? (
        <img
          src={avatarSource}
          alt="Profile"
          className="size-full object-cover"
          onError={() => setFailedAvatarSource(avatarSource)}
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-brand-surface-sunken text-brand-accent">
          <MdPerson className="size-5" />
        </div>
      )}
      <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-brand-accent" />
    </div>
  )

  const accountActions = (
    <>
      <li className="px-3 pb-2 pt-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Signed in as</span>
        <span className="mt-1.5 flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-brand-content">{profile?.name || user?.email}</span>
          {role && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${ROLE_BADGE_CLASSES[role]}`}
            >
              {ROLE_LABELS[role]}
            </span>
          )}
        </span>
      </li>
      <li>
        <button
          onClick={() => {
            closeMobileMenu()
            setIsProfileOpen(true)
          }}
          className="flex items-center gap-2.5 rounded-xl text-slate-700 transition hover:bg-brand-surface-sunken hover:text-brand-content"
        >
          <MdSettings className="size-4" /> Edit Profile
        </button>
      </li>
      <li>
        <button onClick={handleLogout} className="flex items-center gap-2.5 rounded-xl text-red-500 transition hover:bg-red-50">
          <MdLogout className="size-4" /> Logout
        </button>
      </li>
    </>
  )

  const searchField = (id) => (
    <form onSubmit={handleTrackingSubmit} role="search" className="w-full">
      <div className="relative flex items-center">
        <MdSearch className="pointer-events-none absolute left-3.5 size-4 shrink-0 text-brand-content-muted" />
        <input
          id={id}
          ref={id === 'nav-tracking' ? searchInputRef : undefined}
          type="text"
          value={trackingId}
          onChange={(event) => setTrackingId(event.target.value)}
          placeholder="Track your parcel…"
          aria-label="Tracking ID"
          autoComplete="off"
          className="h-10 w-full rounded-full border border-brand-content/10 bg-white/80 pl-10 pr-16 text-sm text-brand-content outline-none transition placeholder:text-brand-content-subtle focus:border-brand-accent/50 focus:bg-white focus:ring-4 focus:ring-brand-accent/10"
        />
        <button
          type="submit"
          className="absolute right-1.5 rounded-full bg-brand-surface-inverse px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-surface-inverse-hover active:scale-95"
        >
          Track
        </button>
      </div>
    </form>
  )

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 pt-3 transition-all duration-300 sm:pt-4 ${
        isScrolled ? 'drop-shadow-[0_10px_30px_rgba(31,42,29,0.10)]' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-8">
        <div
          className={`flex h-16 items-center gap-3 rounded-2xl border px-3 backdrop-blur-xl transition-all duration-300 sm:h-[72px] sm:px-4 ${
            isScrolled
              ? 'border-white/70 bg-white/85 shadow-[0_8px_32px_rgba(31,42,29,0.10)]'
              : 'border-white/50 bg-white/60'
          }`}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="-ml-1 flex size-10 items-center justify-center rounded-xl text-brand-content transition hover:bg-brand-surface-inverse/5 lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="primary-navigation"
            >
              <span className="relative flex h-4 w-5 flex-col justify-between">
                <span
                  className={`h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                    isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                    isMobileMenuOpen ? 'opacity-0' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                    isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
            <Logo />
          </div>

          <nav aria-label="Primary" className="hidden min-w-0 flex-1 justify-center lg:flex">
            <ul
              ref={navListRef}
              className="relative flex items-center gap-1 rounded-full border border-brand-content/8 bg-brand-surface-inverse/[0.04] p-1"
            >
              <span
                data-pill
                data-visible="false"
                aria-hidden="true"
                className="absolute left-0 top-1 h-[calc(100%-0.5rem)] rounded-full bg-white opacity-0 shadow-[0_2px_10px_rgba(31,42,29,0.10)] ring-1 ring-brand-accent/25 transition-[width,transform,opacity] duration-300 ease-out data-[visible=true]:opacity-100"
              />
              {navLinks.map((link) => {
                const isActive = isLinkActive(pathname, link.href)
                const Icon = NAV_ICONS[link.href]

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-nav-href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-200 ${
                        isActive
                          ? 'font-semibold text-brand-content'
                          : 'font-medium text-brand-content-muted hover:text-brand-content'
                      }`}
                    >
                      {Icon && <Icon className="size-4 shrink-0 opacity-80" />}
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <div className="hidden md:block">
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isSearchOpen
                    ? 'w-64 opacity-100 xl:w-72'
                    : 'w-10 opacity-0'
                }`}
              >
                {isSearchOpen ? (
                  searchField('nav-tracking')
                ) : (
                  <button
                    type="button"
                    onClick={openSearch}
                    className="flex size-10 items-center justify-center rounded-full text-brand-content transition hover:bg-brand-surface-inverse/5"
                    aria-label="Track a parcel"
                    tabIndex={isSearchOpen ? -1 : 0}
                  >
                    <MdSearch className="size-5" />
                  </button>
                )}
              </div>
            </div>

            {user && (
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  className={`relative flex size-10 items-center justify-center rounded-full text-brand-content transition hover:bg-brand-surface-inverse/5 ${
                    isNotificationsOpen ? 'bg-brand-surface-inverse/5' : ''
                  }`}
                  aria-label="Open notifications"
                  aria-expanded={isNotificationsOpen}
                  onClick={() => setIsNotificationsOpen((open) => !open)}
                >
                  <span className="nav-bell-ring block">
                    <MdNotifications className="size-5" />
                  </span>
                  <span className="absolute right-2.5 top-2.5 flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-accent opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-brand-accent ring-2 ring-white" />
                  </span>
                </button>

                <div
                  tabIndex={0}
                  className="dropdown-content z-50 mt-3 w-80 rounded-2xl border border-white/70 bg-white/95 p-0 shadow-[0_16px_48px_rgba(31,42,29,0.16)] backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between border-b border-brand-surface px-4 py-3">
                    <p className="text-sm font-semibold text-brand-content">Notifications</p>
                    <button
                      type="button"
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-brand-accent transition hover:bg-brand-surface-sunken"
                    >
                      Mark all read
                    </button>
                  </div>
                  <ul className="menu gap-0.5 p-2 text-sm">
                    <li>
                      <span className="flex items-start gap-3 rounded-xl hover:bg-brand-surface">
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-accent" />
                        <span className="flex flex-col">
                          <span className="font-medium text-brand-content">Rider assigned to your parcel</span>
                          <span className="text-xs text-brand-content-subtle">Pickup scheduled for today</span>
                        </span>
                      </span>
                    </li>
                    <li>
                      <span className="flex items-start gap-3 rounded-xl hover:bg-brand-surface">
                        <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-accent" />
                        <span className="flex flex-col">
                          <span className="font-medium text-brand-content">Payment receipt is ready</span>
                          <span className="text-xs text-brand-content-subtle">View your latest invoice</span>
                        </span>
                      </span>
                    </li>
                  </ul>
                  <div className="border-t border-brand-surface p-2">
                    <Link
                      href="/dashboard"
                      className="block rounded-xl px-3 py-2 text-center text-xs font-semibold text-brand-content-strong transition hover:bg-brand-surface-sunken"
                    >
                      View all activity
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {user ? (
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  tabIndex={0}
                  className="group rounded-full ring-offset-2 ring-offset-transparent"
                  aria-label="Open account menu"
                >
                  {renderAvatar()}
                </button>

                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-50 mt-3 w-64 gap-0.5 rounded-2xl border border-white/70 bg-white/95 p-2 text-sm shadow-[0_16px_48px_rgba(31,42,29,0.16)] backdrop-blur-xl"
                >
                  {accountActions}
                </ul>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full px-3.5 py-2 text-sm font-semibold text-brand-content-strong transition hover:bg-brand-surface-sunken sm:block"
                >
                  Log In
                </Link>
                <Link
                  href="/send-parcel"
                  className="group relative overflow-hidden rounded-full bg-brand-surface-inverse px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(31,42,29,0.22)] transition hover:shadow-[0_10px_26px_rgba(31,42,29,0.28)] active:scale-95 sm:px-5"
                >
                  <span className="relative z-10">Book Delivery</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-brand-accent via-brand-accent-bright to-brand-accent transition-transform duration-500 group-hover:translate-x-0" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <button
            type="button"
            onClick={closeMobileMenu}
            className="fixed inset-x-0 bottom-0 top-[88px] z-30 cursor-default bg-brand-surface-inverse/25 backdrop-blur-[3px] sm:top-[104px] lg:hidden"
            aria-label="Close navigation menu"
          />
          <nav
            id="primary-navigation"
            aria-label="Primary mobile"
            className="nav-panel-in absolute inset-x-0 top-full z-40 mx-3 mt-2 overflow-hidden rounded-2xl border border-white/70 bg-white/95 p-3 shadow-[0_24px_60px_rgba(31,42,29,0.18)] backdrop-blur-xl sm:mx-5 lg:hidden"
          >
            <div className="md:hidden">{searchField('nav-tracking-mobile')}</div>

            <ul className="mt-3 space-y-1 md:mt-0">
              {navLinks.map((link, index) => {
                const isActive = isLinkActive(pathname, link.href)
                const Icon = NAV_ICONS[link.href]

                return (
                  <li
                    key={link.href}
                    className="nav-item-rise"
                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] transition ${
                        isActive
                          ? 'bg-brand-surface-sunken font-semibold text-brand-content ring-1 ring-brand-accent/25'
                          : 'font-medium text-brand-content-muted hover:bg-brand-surface hover:text-brand-content'
                      }`}
                    >
                      {Icon && <Icon className="size-4 shrink-0 opacity-70" />}
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {user && (
              <ul className="menu mt-3 gap-0.5 border-t border-brand-surface p-0 pt-3 text-sm">{accountActions}</ul>
            )}

            {!user && (
              <div className="mt-3 flex flex-col gap-2 border-t border-brand-surface pt-3 sm:flex-row">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex-1 rounded-full border border-brand-content/15 px-5 py-2.5 text-center text-sm font-semibold text-brand-content transition hover:bg-brand-surface"
                >
                  Log In
                </Link>
                <Link
                  href="/send-parcel"
                  onClick={closeMobileMenu}
                  className="flex-1 rounded-full bg-brand-surface-inverse px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-surface-inverse-hover"
                >
                  Book Delivery
                </Link>
              </div>
            )}
          </nav>
        </>
      )}

      {/* Mount on open so the form is initialized with the latest profile data. */}
      {isProfileOpen && (
        <ProfileModal
          user={profile || {
            name: user?.displayName,
            phone: user?.phoneNumber,
            photoURL: user?.photoURL,
          }}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  )
}

export default Navbar
