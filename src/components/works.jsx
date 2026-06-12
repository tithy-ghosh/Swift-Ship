import React from 'react'
import { FaBoxOpen, FaMapLocationDot, FaTruckFast } from 'react-icons/fa6'
import { MdVerified } from 'react-icons/md'
import { workSteps } from '@/app/data/work.data'

const stepIcons = [FaBoxOpen, FaTruckFast, FaMapLocationDot, MdVerified]

const Works = () => {
  return (
    <section className="flex flex-col gap-12 pb-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center text-center pt-4">
        <p className=" font-semibold uppercase tracking-wide text-[#4d8d41]"
        style={{
            "fontSize": "32px"
        }}
        >
          How it works
        </p>
        <h2 className="mt-2  font-bold text-[#1f2a1d]">
          Ship your package in four simple steps.
        </h2>
        <p className=" leading-7 text-[#596257]"
        style={{
          "marginTop": "0.5rem"
        }}
        >
          From booking to delivery, SwiftShip keeps the process simple, clear, and easy to track.
        </p>
      </div>

      <div
        className="grid"
        style={{
          "gridTemplateColumns": 'repeat(auto-fit, minmax(230px, 1fr))',
          "gap": "2rem",
          "paddingTop": "2rem"
        }}
      >
        {workSteps.map((step, index) => {
          const Icon = stepIcons[index]

          return (
            <div
              key={step.number}
              className="h-full rounded-lg border border-white/70 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#83BD75]/20 text-[#4d8d41]">
                  <Icon className="h-7 w-7" />
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
