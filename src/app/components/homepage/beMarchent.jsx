import Link from 'next/link'
import Image from 'next/image'
import { FaArrowRightLong, FaCircleCheck } from 'react-icons/fa6'
import beMarchentData from '@/app/data/beMarchent.data'
import safeDelivery from '@/app/assets/safe-delivery.png'

const BeMarchent = () => {
  return (
    <section
      className="overflow-hidden rounded-lg bg-brand-surface-sunken"
      data-aos="fade-up"
    >
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-16">
        <div
          className="mb-4 flex justify-center sm:mb-6"
          data-aos="fade-up"
          data-aos-delay={50}
        >
          <Image
            src={safeDelivery}
            alt=""
            className="h-20 w-auto object-contain sm:h-24"
            sizes="96px"
            priority={false}
          />
        </div>

        <div
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
          data-aos="fade-up"
        >
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border-subtle bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
            {beMarchentData.eyebrow}
          </span>

          <h2 className="mt-3 text-2xl font-bold leading-tight text-brand-content sm:mt-4 sm:text-4xl">
            {beMarchentData.title}
          </h2>

          <p className="mt-3 max-w-xl text-base leading-7 text-brand-content/80 sm:mt-4">
            {beMarchentData.description}
          </p>
        </div>

        <div
          className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 sm:gap-3"
          data-aos="fade-up"
          data-aos-delay={100}
        >
          {beMarchentData.stats.map((stat) => (
            <div
              key={stat.label}
              className="inline-flex items-baseline gap-1.5 rounded-full border border-brand-border-subtle bg-white/95 px-3 py-1.5 shadow-sm"
            >
              <span className="text-lg font-bold text-brand-content sm:text-xl">
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-brand-content-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <div
          className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 sm:gap-3"
          data-aos="fade-up"
          data-aos-delay={150}
        >
          {beMarchentData.benefits.map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-3 py-1.5 text-sm text-brand-content sm:px-4 sm:py-2"
            >
              <FaCircleCheck className="h-4 w-4 shrink-0 text-brand-accent" />
              {benefit}
            </span>
          ))}
        </div>

        <div
          className="mt-7 flex justify-center sm:mt-9"
          data-aos="fade-up"
          data-aos-delay={200}
        >
          <Link
            href="/be-merchant"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-accent-hover px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-brand-accent active:scale-95 sm:w-auto"
          >
            {beMarchentData.cta.buttonLabel}
            <FaArrowRightLong className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <p
          className="mt-3 text-center text-sm text-brand-content-muted"
          data-aos="fade-up"
          data-aos-delay={250}
        >
          {beMarchentData.cta.description}
        </p>
      </div>
    </section>
  )
}

export default BeMarchent
