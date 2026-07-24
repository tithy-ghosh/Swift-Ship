'use client'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'
import { MdLockOutline, MdOutlineMail } from 'react-icons/md'
import Logo from '../logo'
import { useForm } from 'react-hook-form'
import SocialLogin from './SocialLogin'
import useAuth from '@/app/hooks/useAuth'
import { ensureUserProfile } from '@/features/users/api/userApi'
import { useState } from 'react'

const getRedirectPath = () => {
  const params = new URLSearchParams(window.location.search)
  return params.get('redirect') || '/'
}

const LoginUi = () => {
    const router = useRouter()
    const [submitError, setSubmitError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
      setSubmitError('')
      setLoading(true)
      try {
        const result = await signIn(data.email, data.password)
        await ensureUserProfile(result.user)
          router.push(getRedirectPath())
      } catch (signInError) {
        console.error(signInError)
        setSubmitError(signInError.message || 'Login failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  return (
    <div className="flex min-h-full flex-col px-5 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto inline-flex h-10 w-full max-w-md items-center gap-2 text-lg font-bold">
           <Logo />
          </div>

          <div className="flex min-h-0 flex-1 items-center">
            <div className="mx-auto w-full max-w-md space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#4d8d41]">
                  Welcome back
                </p>
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                  Login to manage your deliveries.
                </h1>
                <p className="text-base leading-7 text-[#596257]">
                  Track parcels, schedule pickups, and keep every shipment moving from one secure dashboard.
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {submitError && (
                  <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">{submitError}</p>
                )}
                <label className="form-control">
                  <span className="label-text pb-2 font-semibold text-[#31542b]">Email address</span>
                  <div className="relative">
                    <MdOutlineMail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
                    <input
                      type="email" {...register('email', {required: true})}
                      placeholder="you@example.com"
                      className="input input-bordered h-12 w-full rounded-md border-[#cbdac7] bg-white pl-12 text-[#1f2a1d] outline-none focus:border-[#83BD75]"
                    />
                    {
                        errors.email?.type === 'required' && <p className='text-sm text-red-600 my-2'>Email is required</p>
                    }
                  </div>
                </label>

                <label className="form-control">
                  <span className="label-text pb-2 font-semibold text-[#31542b]">Password</span>
                  <div className="relative">
                    <MdLockOutline className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
                    <input
                      type="password" {...register('password', {
                        required: true,
                        minLength: 6
                    })}
                      placeholder="Enter your password"
                      className="input input-bordered h-12 w-full rounded-md border-[#cbdac7] bg-white pl-12 text-[#1f2a1d] outline-none focus:border-[#83BD75]"
                    />
                    {
                        errors.password?.type === 'required' && <p className='text-sm text-red-600 my-2'>Password is required</p>
                    }
                    {
                        errors.password?.type === 'minLength' && <p className='text-sm text-red-600 my-2'>Minimum 6 character is required</p>
                    }

                  </div>
                </label>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <label className="mt-1 flex cursor-pointer items-center gap-2 text-[#596257]">
                    <input type="checkbox" className="checkbox checkbox-sm border-[#83BD75]" />
                    Remember me
                  </label>
                  <Link href="#" className="mt-1 font-semibold text-[#4d8d41] hover:text-[#31542b]">
                    Forgot password?
                  </Link>
                </div>

                <button disabled={loading} className="h-12 w-full rounded-md bg-[#83BD75] font-semibold text-[#172015] shadow-md transition hover:bg-[#74ad68] active:scale-[0.99] disabled:cursor-wait disabled:opacity-60">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <SocialLogin />

              <p className="text-sm text-[#596257]">
                New to SwiftShip?{' '}
                <Link href="/register" className="font-semibold text-[#4d8d41] hover:text-[#31542b]">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
  )
}

export default LoginUi
