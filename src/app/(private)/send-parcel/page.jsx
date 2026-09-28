import { Suspense } from 'react'
import SendParcelRoute from './SendParcelRoute'

/**
 * Route composition for parcel booking.
 *
 * Business state lives in useParcelBooking; the client component only connects
 * that workflow to the presentational form. Kept in its own file so the page
 * can be a server component and `useSearchParams` stays inside a Suspense
 * boundary, which is required for the static build of this route.
 */
export default function SendParcelPage() {
  return (
    <Suspense fallback={null}>
      <SendParcelRoute />
    </Suspense>
  )
}
