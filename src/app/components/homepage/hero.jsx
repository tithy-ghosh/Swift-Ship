import Image from 'next/image'
import React from 'react'
import deliveryIcon from '@/app/assets/heroBanner.png'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div className="space-y-6 text-center sm:text-left lg:space-y-7" data-aos="fade-right">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4d8d41]">
            Fast local delivery
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-[#1f2a1d] sm:mx-0 sm:text-5xl lg:text-6xl">
            Send packages faster with SwiftShip.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-[#596257] sm:mx-0 sm:text-lg">
            Book reliable pickup, track every shipment in real time, and get your parcels delivered safely across the city.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href='/send-parcel' className="rounded-full bg-[#83BD75] px-6 py-3 font-semibold text-[#172015] shadow-md transition hover:bg-[#74ad68] active:scale-95">
            Book Delivery
          </Link>
          <button className="rounded-full border border-[#83BD75] px-6 py-3 font-semibold text-[#31542b] transition hover:bg-white active:scale-95">
            Track Package
          </button>
        </div>

        <div className="mx-auto max-w-xl rounded-lg border border-white/70 bg-white/80 p-3 shadow-sm sm:mx-0">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Enter tracking ID"
              className="input input-bordered min-h-12 flex-1 rounded-md bg-white"
            />
            <button className="rounded-md bg-[#1f2a1d] px-5 py-3 font-semibold text-white transition hover:bg-[#31422d] active:scale-95">
              Track Now
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end" data-aos="fade-left">
        <div className="relative w-full max-w-md lg:max-w-none">
          <Image
            src={deliveryIcon}
            alt="SwiftShip delivery"
            className="h-full w-full object-contain"
            priority
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
