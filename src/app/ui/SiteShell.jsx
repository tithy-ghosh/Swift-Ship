'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/app/ui/Navbar'
import Footer from '@/app/ui/Footer'

const authRoutes = ['/login', '/register']

const SiteShell = ({ children }) => {
  const pathname = usePathname()
  const hideSiteChrome = authRoutes.includes(pathname)

  return (
    <>
      {!hideSiteChrome && <Navbar />}
      <div className="flex-1">{children}</div>
      {!hideSiteChrome && <Footer />}
    </>
  )
}

export default SiteShell
