'use client'

import useAuth from "@/app/hooks/useAuth"

const SocialLogin = () => {

    const { signInWithGoogle } = useAuth();
    const handleGoogleSignIn = () =>{
        signInWithGoogle()
        .then(result =>{
            console.log(result.user)
        })
        .catch(error => {
            console.error(error)
        })
    }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-[#dbe7d8]" />
        <span className="text-xs font-semibold uppercase tracking-wide text-[#6b7567]">
          or 
        </span>
        <span className="h-px flex-1 bg-[#dbe7d8]" />
      </div>

      <button
      onClick={handleGoogleSignIn}
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-[#dbe7d8] bg-white px-4 font-semibold text-[#1f2a1d] shadow-sm transition hover:border-[#83BD75] hover:bg-[#f7fbf5] active:scale-[0.99]"
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
        Continue with Google
      </button>
    </div>
  )
}

export default SocialLogin
