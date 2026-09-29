import { FaArrowRightLong, FaCircleCheck } from 'react-icons/fa6'
import beMarchentData from '@/app/data/beMarchent.data'


const BeMarchent = () => {
  return (
    <section
      className="overflow-hidden rounded-lg bg-brand-surface-sunken"
      data-aos="fade-up"
    >
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-8 sm:py-16">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border-subtle bg-white/3 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
          {beMarchentData.eyebrow}
        </span>

        <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl text-brand-content">
          {beMarchentData.title}
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-brand-content/70">
          {beMarchentData.description}
        </p>

       
        <div className="mx-auto mt-9 grid max-w-md gap-3 sm:grid-cols-2 ">
          {beMarchentData.stats.map((stat) => (
            <div
              key={stat.label}
              className="border-l border-brand-accent-bright bg-brand-accent-bright px-4 py-3 text-left"
            >
              <p className="text-2xl font-bold text-brand-content">
                {stat.value}
              </p>
              <p className="mt-1 text-sm leading-5 text-white">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {beMarchentData.benefits.map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/5 px-4 py-2 text-sm text-black/80"
            >
              <FaCircleCheck className="h-4 w-4 shrink-0 text-brand-accent-bright" />
              {benefit}
            </span>
          ))}
        </div>

        
        <button className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent-hover px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-accent active:scale-95">
          {beMarchentData.cta.buttonLabel}
          <FaArrowRightLong className="h-4 w-4" />
        </button>

        <p className="mt-3 text-sm text-white/50">
          {beMarchentData.cta.description}
        </p>
      </div>
    </section>
  )
}

export default BeMarchent
