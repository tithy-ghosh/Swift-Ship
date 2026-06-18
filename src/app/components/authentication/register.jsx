'use client'

import Link from 'next/link'
import React from 'react'
import { MdLockOutline, MdOutlineMail, MdPersonOutline } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import Logo from '../logo'
import useAuth from '@/app/hooks/useAuth'
import SocialLogin from './SocialLogin'

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const {createUser} = useAuth()
  const onSubmit = (data) => {
    console.log(data)
    createUser(data.email, data.password)
    .then( result =>{
        console.log(result.user)
    })
    .catch(error =>{
        console.error(error)
    })
  }

  return (
    <div className="flex min-h-full flex-col px-5 py-8 sm:px-8 lg:px-12">
      <Link href="/" className="mx-auto inline-flex h-10 w-full max-w-md items-center gap-2 text-lg font-bold">
        <Logo />
      </Link>

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <label className="form-control">
              <span className="label-text pb-2 font-semibold text-[#31542b]">Full name</span>
              <div className="relative">
                <MdPersonOutline className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
                <input
                  type="text"
                  {...register('name', { required: true })}
                  placeholder="Your name"
                  className="input input-bordered h-12 w-full rounded-md border-[#cbdac7] bg-white pl-12 text-[#1f2a1d] outline-none focus:border-[#83BD75]"
                />
              </div>
              {errors.name?.type === 'required' && (
                <p className="mt-2 text-sm text-red-600">Name is required</p>
              )}
            </label>

            <label className="form-control">
              <span className="label-text pb-2 font-semibold text-[#31542b]">Email address</span>
              <div className="relative">
                <MdOutlineMail className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
                <input
                  type="email"
                  {...register('email', { required: true })}
                  placeholder="you@example.com"
                  className="input input-bordered h-12 w-full rounded-md border-[#cbdac7] bg-white pl-12 text-[#1f2a1d] outline-none focus:border-[#83BD75]"
                />
              </div>
              {errors.email?.type === 'required' && (
                <p className="mt-2 text-sm text-red-600">Email is required</p>
              )}
            </label>

            <label className="form-control">
              <span className="label-text pb-2 font-semibold text-[#31542b]">Password</span>
              <div className="relative">
                <MdLockOutline className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
                <input
                  type="password"
                  {...register('password', {
                    required: true,
                    minLength: 6,
                  })}
                  placeholder="Create a password"
                  className="input input-bordered h-12 w-full rounded-md border-[#cbdac7] bg-white pl-12 text-[#1f2a1d] outline-none focus:border-[#83BD75]"
                />
              </div>
              {errors.password?.type === 'required' && (
                <p className="mt-2 text-sm text-red-600">Password is required</p>
              )}
              {errors.password?.type === 'minLength' && (
                <p className="mt-2 text-sm text-red-600">Minimum 6 characters are required</p>
              )}
            </label>

            <label className="flex cursor-pointer items-start gap-2 text-sm leading-6 text-[#596257]">
              <input type="checkbox" className="checkbox checkbox-sm mt-1 border-[#83BD75]" />
              I agree to receive shipment updates and SwiftShip service notifications.
            </label>

            <button className="h-12 w-full rounded-md bg-[#83BD75] font-semibold text-[#172015] shadow-md transition hover:bg-[#74ad68] active:scale-[0.99]">
              Create Account
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
