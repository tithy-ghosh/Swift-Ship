'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/app/components/logo'
import useAuth from '@/app/hooks/useAuth'

const Navbar = () => {
  const router = useRouter()
  const { user, logOut } = useAuth()

  const handleLogout = () => {
    logOut()
      .then(() => {
        router.push('/login')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const navItem = <>
  <li><Link href="/">Home</Link></li>
  <li><Link href="/about">About Us</Link></li>
  <li><Link href="/coverage">Coverage</Link></li>
  <li><Link href="/dashboard">Dashboard</Link></li>
  </>
  return (
    <div className="navbar fixed inset-x-0 top-4 z-50 mx-auto w-[calc(100%-1rem)] max-w-3xl rounded-full bg-base-100 text-base-content shadow-xl sm:top-5 sm:w-[calc(100%-2rem)]">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="px-2 lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100  z-1 mt-3 w-52 p-2 shadow">
        {navItem}
      </ul>
    </div>
    <Link href="/" className="min-w-0 px-1">
      <Logo />
    </Link>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1 ">
      {navItem}
    </ul>
  </div>
  <div className="navbar-end">
    {user ? (
      <button
        type="button"
        onClick={handleLogout}
        className="mr-1 cursor-pointer rounded-2xl border border-transparent bg-[#83BD75] px-3 py-1.5 text-sm active:scale-95 hover:border-[#83BD75] hover:bg-transparent sm:mr-2 sm:px-4 sm:text-base"
      >
        Log Out
      </button>
    ) : (
      <Link href="/login" className="mr-1 cursor-pointer rounded-2xl border border-transparent bg-[#83BD75] px-3 py-1.5 text-sm active:scale-95 hover:border-[#83BD75] hover:bg-transparent sm:mr-2 sm:px-4 sm:text-base">Log In</Link>
    )}
  </div>
</div>
  )
}

export default Navbar
