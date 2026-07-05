'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MdLockOutline, MdOutlineMail, MdPersonOutline, MdPhone } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import Logo from '../logo'
import useAuth from '@/app/hooks/useAuth'
import SocialLogin from './SocialLogin'
import { useState } from 'react'

const Register = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { createUser, updateUserProfile } = useAuth()

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    try {
      // 1. Create user in Firebase Auth
      const result = await createUser(data.email, data.password)

      // 2. Update Firebase display name
      await updateUserProfile(data.name)

      // 3. Get Firebase ID token
      const token = await result.user.getIdToken()

      // 4. Save user to MongoDB via backend
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
        }),
      })

      router.push('/')
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login.')
      } else {
        setError('Something went wrong. Please try again.')
      }
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
        <div className="mx-auto w-full max-w-md space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4d8d41]">
              Create account
            </p>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Join SwiftShip today.
            </h1>
            <p className="text-base leading-7 text-[#596257]">
              Set up your delivery dashboard to book pickups, track parcels, and manage shipments faster.
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <label className="form-control">
              <span className="label-text pb-2 font-semibold text-[#31542b]">Full name</span>
              <div className="relative">
                <MdPersonOutline className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  placeholder="Your full name"
                  className="input input-bordered h-12 w-full rounded-md border-[#cbdac7] bg-white pl-12 text-[#1f2a1d] outline-none focus:border-[#83BD75]"
                />
              </div>
              {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
            </label>

            {/* Phone */}
            <label className="form-control">
              <span className="label-text pb-2 font-semibold text-[#31542b]">Phone number</span>
              <div className="relative">
                <MdPhone className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+\-\s]{7,15}$/,
                      message: 'Enter a valid phone number',
                    },
                  })}
                  placeholder="01XXXXXXXXX"
                  className="input input-bordered h-12 w-full rounded-md border-[#cbdac7] bg-white pl-12 text-[#1f2a1d] outline-none focus:border-[#83BD75]"
                />
              </div>
              {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
            </label>

            {/* Email */}
            <label className="form-control">
              <span className="label-text pb-2 font-semibold text-[#31542b]">Email address</span>
              <div className="relative">
                <MdOutlineMail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="you@example.com"
                  className="input input-bordered h-12 w-full rounded-md border-[#cbdac7] bg-white pl-12 text-[#1f2a1d] outline-none focus:border-[#83BD75]"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </label>

            {/* Password */}
            <label className="form-control">
              <span className="label-text pb-2 font-semibold text-[#31542b]">Password</span>
              <div className="relative">
                <MdLockOutline className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Minimum 6 characters required' },
                  })}
                  placeholder="Create a password"
                  className="input input-bordered h-12 w-full rounded-md border-[#cbdac7] bg-white pl-12 text-[#1f2a1d] outline-none focus:border-[#83BD75]"
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </label>

            <label className="flex cursor-pointer items-start gap-2 text-sm leading-6 text-[#596257]">
              <input type="checkbox" className="checkbox checkbox-sm mt-1 border-[#83BD75]" />
              I agree to receive shipment updates and SwiftShip service notifications.
            </label>

            <button
              disabled={loading}
              className="h-12 w-full rounded-md bg-[#83BD75] font-semibold text-[#172015] shadow-md transition hover:bg-[#74ad68] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <SocialLogin />

          <p className="text-sm text-[#596257]">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#4d8d41] hover:text-[#31542b]">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
