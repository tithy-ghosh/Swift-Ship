import React from 'react'
import { FaBoxOpen, FaMapLocationDot, FaTruckFast } from 'react-icons/fa6'
import { MdVerified } from 'react-icons/md'
import workSteps from '@/app/data/work.data.json'

const stepIcons = [FaBoxOpen, FaTruckFast, FaMapLocationDot, MdVerified]

const Works = () => {
  return (
    <section className="flex flex-col gap-10 pb-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center pt-4 text-center">
        <p className="text-3xl font-semibold uppercase tracking-wide text-[#4d8d41]">
          How it works
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#1f2a1d] sm:text-3xl">
          Ship your package in four simple steps.
        </h2>
        <p className="mt-3 text-base leading-7 text-[#596257]">
          From booking to delivery, SwiftShip keeps the process simple, clear, and easy to track.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 pt-4 min-[520px]:grid-cols-2 lg:grid-cols-4">
        {workSteps.map((step, index) => {
          const Icon = stepIcons[index]

          return (
            <div
              key={step.number}
              className="h-full rounded-lg border border-white/70 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#83BD75]/20 text-[#4d8d41]">
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#1f2a1d]">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#596257]">
                {step.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Works
