import React from 'react'
import {
  FaArrowRightLong,
  FaBoxesStacked,
  FaBuilding,
  FaClock,
  FaMoneyBillWave,
  FaRotateLeft,
  FaTruckFast,
} from 'react-icons/fa6'
import services from '@/app/data/services.data.json'

const serviceIcons = [
  FaClock,
  FaTruckFast,
  FaBoxesStacked,
  FaMoneyBillWave,
  FaBuilding,
  FaRotateLeft,
]

const OurServices = () => {
  return (
    <section
      className="rounded-lg bg-[#f7faf4] px-4 py-10 sm:px-8 sm:py-12 lg:px-10"
      data-aos="fade-up"
    >
      <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-4 text-center">
        <div>
          <p className="text-2xl font-semibold uppercase tracking-wide text-[#4d8d41] sm:text-3xl">
            Our services
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-bold leading-tight text-[#1f2a1d] sm:text-4xl">
            One delivery partner, several ways to move.
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-[#596257]">
          Pick the service model that matches the order, customer, and delivery
          promise without changing your operating flow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const Icon = serviceIcons[index]
         

          return (
            <article
              key={service.title}
              className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-lg border border-[#83BD75] bg-[#1f2a1d] p-5 text-white transition hover:-translate-y-1 hover:shadow-md sm:p-6"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className='absolute -right-8 -top-8 h-28 w-28 rounded-full  bg-white/10'
               
              />

              <div className="relative z-10">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div
                    className='flex h-12 w-12 items-center justify-center rounded-full bg-[#83BD75] text-[#172015]'
                        
                    
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className='text-sm font-bold  text-white/40' 
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3
                  className='max-w-xl text-xl font-bold leading-snug sm:text-2xl' 
                >
                  {service.title}
                </h3>
                <p
                  className='mt-4 leading-6 max-w-2xl text-base text-white/70'
                      
                >
                  {service.description}
                </p>
              </div>

              <div
                className='mt-8 flex items-center gap-2 text-sm font-semibold text-[#b5e6a8]' 
              >
                Service details
                <FaArrowRightLong className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default OurServices
