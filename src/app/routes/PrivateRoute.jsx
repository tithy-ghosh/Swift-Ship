'use client'

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import useAuth from "../hooks/useAuth"

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [loading, pathname, router, user])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-xl text-[#83BD75]" />
      </div>
    )
  }

  return children
}

export default PrivateRoute
