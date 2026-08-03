import DashboardShell from '@/app/ui/DashboardShell'

/**
 * Provides the responsive navigation shell shared by dashboard routes.
 *
 * Authentication is intentionally handled by the parent `(private)` layout,
 * preventing nested guards and duplicate full-screen loading states.
 */
export default function BeRiderLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>
}
