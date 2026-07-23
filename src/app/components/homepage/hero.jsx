import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaBoxOpen, FaLocationDot, FaRoute, FaTruckFast } from 'react-icons/fa6'
import heroBanner  from '../../assets/heroBanner.png'

const deliveryIcons = [
  { name: 'package', Icon: FaBoxOpen, position: 'left-2 top-10 sm:left-4 lg:-left-2' },
  { name: 'truck', Icon: FaTruckFast, position: 'right-2 top-16 sm:right-4 lg:-right-2' },
  { name: 'location', Icon: FaLocationDot, position: 'bottom-16 left-3 sm:left-7 lg:-left-1' },
  { name: 'route', Icon: FaRoute, position: 'bottom-8 right-5 sm:right-10 lg:right-3' },
]

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

      <div className="flex items-center justify-center lg:justify-end" data-aos="fade-left">
        <div className="relative isolate w-full max-w-md py-8 lg:max-w-none">
          <div className="absolute inset-x-6 bottom-10 top-14 z-0 rounded-[42%_58%_48%_52%/55%_38%_62%_45%] bg-gradient-to-br from-[#dff2d9] via-[#b9ddaf] to-[#83BD75]/80 shadow-[0_24px_70px_rgba(77,141,65,0.22)]" />

          <div className="absolute inset-0 z-20" aria-hidden="true">
            {deliveryIcons.map(({ name, Icon, position }) => (
              <div
                key={name}
                className={`absolute flex size-11 items-center justify-center rounded-2xl border border-white/80 bg-white/95 text-lg text-[#4d8d41] shadow-lg backdrop-blur-sm sm:size-12 lg:size-14 lg:text-xl ${position}`}
              >
                <Icon />
              </div>
            ))}
          </div>

          <Image
            src={heroBanner}
            alt="Hero banner"
            className="relative z-10 mx-auto h-auto max-h-[460px] w-auto max-w-full lg:mr-0 lg:max-h-[600px]"
            priority
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
