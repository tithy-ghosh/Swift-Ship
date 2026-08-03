'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { MdPerson, MdSettings, MdLogout } from 'react-icons/md'

import Logo from '@/app/components/logo'
import useAuth from '@/app/hooks/useAuth'
import { getUserProfile } from '@/features/users/api/userApi'
import ProfileModal from '@/app/components/profile/ProfileModal'
import { getProfileImageSource, getProfilePhoto } from '@/app/utils/profileImage'

const Navbar = () => {
  const router = useRouter()
  const { user, logOut } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [failedAvatarSource, setFailedAvatarSource] = useState('')

  // Fetch profile data for the navbar avatar/name
  const { data: profile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    enabled: !!user, // Only fetch if user is logged in
  })

  const handleLogout = () => {
    logOut()
      .then(() => {
        router.push('/login')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const avatarSource = getProfileImageSource(getProfilePhoto(profile)) || user?.photoURL || ''

  const navItem = (
    <>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/about">About Us</Link>
      </li>
      <li>
        <Link href="/coverage">Coverage</Link>
      </li>
      <li>
        <Link href="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link href='/be-rider'>Become a Rider</Link>
      </li>
    </>
  )

  return (
    <div className="navbar fixed inset-x-0 top-0 z-40 mx-auto max-w-7xl border-b bg-[#edf7ea] px-4 py-4 sm:px-6 lg:px-14">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="px-2 lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 z-1 mt-3 w-52 p-2 shadow">
            {navItem}
          </ul>
        </div>
        <div href="/" className="min-w-0 px-1">
          <Logo />
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navItem}</ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            {/* Profile Avatar Button */}
            <div tabIndex={0} role="button" className="btn  btn-circle avatar cursor-pointer">
              <div className="w-10 rounded-full ring ring-[#83BD75] ring-offset-2 ring-offset-[#edf7ea]">
                {avatarSource && avatarSource !== failedAvatarSource ? (
                  <img
                    src={avatarSource}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setFailedAvatarSource(avatarSource)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#d9ebd4] text-[#4d8d41] rounded-full">
                    <MdPerson className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Dropdown Menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-56 border border-slate-100"
            >
              <li className="menu-title px-4 py-2">
                <span className="text-xs font-bold text-slate-400">Signed in as</span>
                <span className="text-sm font-bold text-[#1f2a1d] truncate block">
                  {profile?.name || user.email}
                </span>
              </li>
              <li>
                <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 text-slate-700 hover:text-[#4d8d41] active:bg-[#A5CF83]">
                  <MdSettings className="w-4 h-4" /> Edit Profile
                </button>
              </li>
              <li>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50">
                  <MdLogout className="w-4 h-4" /> Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            href="/login"
            className="mr-1 cursor-pointer rounded-2xl border border-transparent bg-[#83BD75] px-3 py-1.5 text-sm font-semibold text-[#172015] active:scale-95 hover:border-[#83BD75] hover:bg-transparent sm:mr-2 sm:px-4 sm:text-base"
          >
            Log In
          </Link>
        )}
      </div>

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
    </div>
  )
}

export default Navbar
