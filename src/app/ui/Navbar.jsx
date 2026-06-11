import Link from 'next/link'
import React from 'react'
import Logo from '@/components/logo'

const Navbar = () => {

  const navItem = <>
  <li><Link href="/">Home</Link></li>
  <li><Link href="/about">About Us</Link></li>
  </>
  return (
    <div className="navbar bg-base-100 text-base-content shadow-xl  rounded-full  fixed top-5 inset-x-0 max-w-2xl mx-auto ">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="px-1 lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100  z-1 mt-3 w-52 p-2 shadow">
        {navItem}
      </ul>
    </div>
    <Link href="/" className=" px-1">
      <Logo />
    </Link>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1 ">
      {navItem}
    </ul>
  </div>
  <div className="navbar-end">
    <a className="border border-transparent px-4 py-1.5 rounded-2xl bg-[#83BD75] mr-2 active:scale-95  hover:border-[#83BD75] hover:bg-transparent cursor-pointer">Log In</a>
  </div>
</div>
  )
}

export default Navbar
