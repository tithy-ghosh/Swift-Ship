'use client'

import { useQuery } from '@tanstack/react-query'
import { getPublicSettings } from '@/features/settings/api/settingsApi'

/**
 * Reads the admin-controlled availability switches for public, unauthenticated
 * pages.
 *
 * Why this exists: `maintenanceMode`, `allowNewRegistrations` and
 * `allowNewParcelBookings` are editable at /admin/settings and have been for a
 * while, but nothing outside that page ever read them. An admin could toggle
 * "Maintenance Mode" or "Allow New Parcel Bookings" off, save, and the site
 * carried on exactly as before. The controls were real in the database and
 * inert in the product. This hook is the missing link.
 *
 * It wraps `getPublicSettings()` (GET /api/settings/public), which was
 * already defined in settingsApi.js and had zero callers.
 *
 * DEFAULTS ARE DELIBERATELY PERMISSIVE and mirror the `getChecked` helpers in
 * admin/settings/page.jsx exactly:
 *   maintenanceMode          -> false
 *   allowNewRegistrations    -> true
 *   allowNewParcelBookings   -> true
 *   businessHours.isOpen24_7 -> true
 *
 * This is a safety decision, not laziness. These switches can take the whole
 * site down, so an absent field, a partial API response, or a failed fetch must
 * NOT resolve to "closed". Anything else means a flaky network or a backend
 * that has not shipped `/api/settings/public` yet takes down parcel booking
 * and signup for every visitor. Fails open, always.
 *
 * This is a client-side convenience gate, not the authority. The server should
 * independently reject a booking when `allowNewParcelBookings` is false; this
 * hook exists to fail fast and explain why, not to be the thing that enforces
 * it. A user can always bypass the client.
 */

const STALE_TIME = 30_000

const normalise = (data) => {
  const system = data?.system || {}
  const businessHours = data?.businessHours || {}

  return {
    maintenanceMode: system.maintenanceMode === true,
    allowNewRegistrations: system.allowNewRegistrations !== false,
    allowNewParcelBookings: system.allowNewParcelBookings !== false,
    isOpen24_7: businessHours.isOpen24_7 !== false,
    openingTime: businessHours.openingTime || '08:00',
    closingTime: businessHours.closingTime || '20:00',
  }
}

/**
 * @returns {{
 *   maintenanceMode: boolean,
 *   allowNewRegistrations: boolean,
 *   allowNewParcelBookings: boolean,
 *   isOpen24_7: boolean,
 *   openingTime: string,
 *   closingTime: string,
 *   isLoading: boolean,
 * }}
 *   While the query is in flight every flag is already at its permissive
 *   default, so a page renders normally and then tightens if it needs to.
 */
export const usePublicSettings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['publicSettings'],
    queryFn: getPublicSettings,
    staleTime: STALE_TIME,
    refetchOnWindowFocus: true,
    retry: 1,
  })

  return { ...normalise(data), isLoading }
}

export default usePublicSettings
