import React from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import services from '@/app/data/services.data'

/**
 * Our services.
 *
 * Bento rather than a uniform grid. The old version was six identical dark
 * cards, which read as a flat list of peers and sat directly above the dark
 * `PricingTiers` panel wearing the same `#1f2a1d` + `#83BD75` palette.
 *
 * Two changes fix both problems at once:
 *  - Light tiles on the `#f7faf4` tint, matching `speciality.jsx`, so the dark
 *    section below is no longer doubled up.
 *  - Exactly one dark tile, the featured service, to anchor the block and
 *    signal which offer is primary.
 *
 * The 3x3 grid fills exactly: featured takes a 2x2 slot, five tiles take the
 * rest. `lg:auto-rows` is fixed so the span is deterministic, and it is
 * desktop-only -- below `lg` every tile is a single auto-height cell.
 *
 * The featured tile is twice the area of the others and has to earn it. Its
 * `highlights` list exists to fill that space with scannable detail; the
 * description alone left ~200px of dead air above the meta chip. Highlights
 * cover *what else comes with it* rather than restating the speed claims the
 * description already makes.
 */
const OurServices = () => {
  return (
    <section
      className="rounded-lg bg-brand-surface-muted px-4 py-10 sm:px-8 sm:py-12 lg:px-10"
      data-aos="fade-up"
    >
      <div
        className="mx-auto mb-10 flex max-w-2xl flex-col items-center text-center"
        data-aos="fade-up"
      >
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border-subtle bg-brand-surface px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
          Our services
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-tight text-brand-content sm:text-4xl">
          One delivery partner, several ways to move.
        </h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-brand-content-muted">
          Pick the service model that matches the order, customer, and delivery
          promise without changing your operating flow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[16rem] lg:grid-cols-3">
        {services.map((service, index) => {
          const {
            id,
            icon: Icon,
            eyebrow,
            title,
            description,
            meta,
            featured,
            highlights,
          } = service

          return (
            <article
              key={id}
              className={[
                'group relative flex flex-col overflow-hidden rounded-lg border p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6',
                featured
                  ? 'border-brand-content bg-brand-surface-inverse text-white lg:col-span-2 lg:row-span-2'
                  : 'border-brand-border-subtle bg-white text-brand-content hover:border-brand-accent-bright',
              ].join(' ')}
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              {featured && (
                <div
                  className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/5"
                  aria-hidden="true"
                />
              )}

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={[
                      'flex shrink-0 items-center justify-center',
                      featured
                        ? 'size-12 rounded-xl bg-brand-accent-bright text-brand-surface-inverse-deep'
                        : 'size-10 rounded-xl bg-brand-surface-sunken text-brand-accent',
                    ].join(' ')}
                  >
                    <Icon className={featured ? 'size-6' : 'size-5'} />
                  </div>
                  <span
                    className={[
                      'text-sm font-bold',
                      featured ? 'text-white/30' : 'text-brand-content/25',
                    ].join(' ')}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {featured && (
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent-bright">
                    {eyebrow}
                  </p>
                )}

                <h3
                  className={[
                    'font-bold leading-snug',
                    featured ? 'mt-2 max-w-md text-2xl sm:text-3xl' : 'mt-4 text-lg',
                  ].join(' ')}
                >
                  {title}
                </h3>

                <p
                  className={[
                    featured
                      ? 'mt-3 max-w-xl text-base leading-7 text-white/70'
                      : 'mt-2 line-clamp-2 text-sm leading-6 text-brand-content-muted',
                  ].join(' ')}
                >
                  {description}
                </p>

                {featured && highlights && (
                  <ul className="mt-5 flex flex-col gap-2">
                    {highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm leading-6 text-white/80"
                      >
                        <FaCircleCheck className="size-4 shrink-0 text-brand-accent-bright" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto pt-3">
                  <span
                    className={[
                      'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold',
                      featured
                        ? 'bg-white/10 text-brand-content-on-dark-muted'
                        : 'border border-brand-border-subtle bg-brand-surface-sunken text-brand-content-strong',
                    ].join(' ')}
                  >
                    {meta}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default OurServices
