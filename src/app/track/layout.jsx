/**
 * Public shell for the tracking route.
 *
 * This used to wrap the page in `DashboardShell`, which renders `SideBar` — a
 * menu of dashboard links, payment history, and seven admin routes. `/track` is
 * a public page: it lives outside the `(private)` and `(auth)` route groups and
 * calls `/api/tracking/:id` with no credentials, so that sidebar was being
 * shown to anonymous visitors as if they were signed-in admins.
 *
 * Only the fixed-Navbar clearance is kept. The page supplies its own horizontal
 * padding and `max-w-4xl` measure, so the dark hero banner now runs full-bleed
 * to the viewport edges instead of being boxed inside a `max-w-7xl` column
 * beside a 16rem sidebar.
 */
export default function TrackLayout({ children }) {
  return (
    <div className="min-h-screen bg-brand-surface-muted pt-24 sm:pt-28">
      {children}
    </div>
  )
}
