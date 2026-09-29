'use client'

import { useRouter } from "next/navigation"
import useAuth from "@/app/hooks/useAuth"
import { ensureUserProfile } from "@/features/users/api/userApi"
import { useState } from "react"

const getRedirectPath = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get("redirect") || "/"
}

const SocialLogin = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const { signInWithGoogle } = useAuth();
    const handleGoogleSignIn = async () =>{
      setLoading(true)
      setError("")
      try {
        const result = await signInWithGoogle()
        await ensureUserProfile(result.user)
            router.push(getRedirectPath())
      } catch (signInError) {
        setError(signInError.message || "Google sign-in failed. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-brand-border-subtle" />
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-content-muted">
          or 
        </span>
        <span className="h-px flex-1 bg-brand-border-subtle" />
      </div>

      <button
      onClick={handleGoogleSignIn}
        disabled={loading}
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-brand-border-subtle bg-white px-4 font-semibold text-brand-content shadow-sm transition hover:border-brand-accent-bright hover:bg-brand-surface-muted active:scale-[0.99] disabled:cursor-wait disabled:opacity-60"
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="m0 0H512V512H0" fill="#fff" />
          <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
          <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
          <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
          <path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
        </svg>
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default SocialLogin
