'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/app/ui/Navbar'
import Footer from '@/app/ui/Footer'
import MobileActionBar from '@/app/ui/MobileActionBar'

const authRoutes = ['/login', '/register']

/**
 * Page chrome: navbar, page body, footer, and the phone-only action bar.
 *
 * `usePathname`, not a prop. The bar and the footer's bottom padding are both
 * conditional, and a route passed down from four layouts would be a fourth
 * thing to update every time a page is added. Reading it here means the rule
 * "the bar belongs to the homepage and nowhere else" lives in exactly one place.
 *
 * The bar is `fixed`, so it occupies no space in the flow and would otherwise
 * sit on top of the last thing on the page. That is what the footer's
 * `pb-[7rem]` is for. The number is deliberately larger than the bar's own
 * height (about 68px, plus the iOS home-indicator inset) - matching the bar
 * exactly would leave the footer's last row flush against it.
 *
 * `lg:pb-10` restores the footer's default `p-10` at the breakpoint where the
 * bar is `lg:hidden`. If the reset were missing, the desktop footer would keep
 * a phone's worth of trailing whitespace.
 */
const SiteShell = ({ children }) => {
  const pathname = usePathname()
  const hideSiteChrome = authRoutes.includes(pathname)
  const showActionBar = !hideSiteChrome && pathname === '/'

  return (
    <>
      {!hideSiteChrome && <Navbar />}
      <div className="flex-1">{children}</div>
      {!hideSiteChrome && (
        <Footer className={showActionBar ? 'pb-[7rem] lg:pb-10' : ''} />
      )}
      {showActionBar && <MobileActionBar />}
    </>
  )
}

export default SiteShell
