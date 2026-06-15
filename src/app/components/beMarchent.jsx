import {
  FaArrowRightLong,
  FaBoxesPacking,
  FaChartLine,
  FaCircleCheck,
  FaHandshake,
  FaTruckFast,
} from 'react-icons/fa6'
import beMarchentData from '@/app/data/beMarchent.data'

const BeMarchent = () => {
  const processIcons = [FaTruckFast, FaBoxesPacking, FaChartLine]

  return (
    <section
      className="overflow-hidden rounded-lg bg-[#172015] text-white"
      data-aos="fade-up"
    >
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative px-4 py-10 sm:px-8 sm:py-12 lg:px-10">
          <div className="absolute right-0 top-0 hidden h-full w-px bg-white/10 lg:block" />

          <div className="max-w-xl text-center sm:text-left">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b5e6a8]">
              {beMarchentData.eyebrow}
            </p>
            <h2 className="mt-4 text-2xl font-bold leading-tight sm:text-4xl">
              {beMarchentData.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-white/70">
              {beMarchentData.description}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {beMarchentData.stats.map((stat) => (
              <div
                key={stat.label}
                className="border-l border-[#83BD75] bg-white/5 px-4 py-3"
              >
                <p className="text-2xl font-bold text-[#b5e6a8]">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm leading-5 text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
            {beMarchentData.benefits.map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
              >
                <FaCircleCheck className="h-4 w-4 text-[#83BD75]" />
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#eef7ea] p-4 text-[#1f2a1d] sm:p-8 lg:p-10">
          <div className="rounded-lg bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#83BD75] text-[#172015]">
                <FaHandshake className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {beMarchentData.cta.title}
                </h3>
                <p className="text-sm text-[#596257]">
                  {beMarchentData.cta.subtitle}
                </p>
              </div>
            </div>

            <p className="mt-5 text-base leading-7 text-[#596257]">
              {beMarchentData.cta.description}
            </p>

            <div className="mt-6 space-y-3">
              {beMarchentData.cta.steps.map((step) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#83BD75]/20 text-[#4d8d41]">
                    <FaCircleCheck className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-semibold text-[#31542b]">
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#1f2a1d] px-5 py-3 font-semibold text-white transition hover:bg-[#31422d] active:scale-95">
              {beMarchentData.cta.buttonLabel}
              <FaArrowRightLong className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 text-center text-sm font-semibold text-[#31542b] min-[420px]:grid-cols-3">
            {beMarchentData.process.map((item, index) => {
              const Icon = processIcons[index]

              return (
                <div key={item} className="rounded-md bg-white/70 px-2 py-3">
                  <Icon className="mx-auto mb-2 h-5 w-5 text-[#4d8d41]" />
                  {item}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BeMarchent
