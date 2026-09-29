import React from 'react'
import Link from 'next/link'
import { FaBoxOpen, FaMapLocationDot, FaTruckFast } from 'react-icons/fa6'
import { MdArrowForward, MdVerified } from 'react-icons/md'
import workSteps from '@/app/data/work.data.json'

const stepIcons = [FaBoxOpen, FaTruckFast, FaMapLocationDot, MdVerified]

/**
 * Rail inset.
 *
 * Node `i` is centred at `(i + 0.5) / total` of its *column*, and the columns
 * are separated by `lg:gap-6` (1.5rem). A plain percentage therefore misses both
 * outer node centres by 9px at every container width. Insetting by half a
 * column width is exact at any size: `(container - (total - 1) * gap) / (2 * total)`.
 *
 * The `1.5` here must stay in sync with the `lg:gap-6` on the grid below.
 */
const railInset = `calc((100% - ${(workSteps.length - 1) * 1.5}rem) / ${workSteps.length * 2})`

/**
 * How it works.
 *
 * Deliberately not another card grid. Every other section on this page is a
 * grid of boxes, so a fourth one made the process read like a feature list.
 * This is a connected rail instead: the line runs through the step markers, so
 * the left-to-right order is visible before any text is read.
 *
 * The node is stacked above its title rather than beside it. A rail at the
 * vertical centre of a node-beside-title row cuts straight through the text.
 */
const Works = () => {
  return (
    <section className="flex flex-col gap-10 rounded-lg bg-brand-surface-sunken px-4 py-10 sm:px-8 sm:py-12 lg:px-10">
      <div
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
        data-aos="fade-up"
      >
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border-subtle bg-brand-surface px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
          How it works
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-tight text-brand-content sm:text-4xl">
          Four steps from your door to theirs.
        </h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-brand-content-muted">
          From booking to delivery, SwiftShip keeps the process simple, clear,
          and easy to track.
        </p>
      </div>

      <div className="relative grid gap-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-6">
        {/* Connector, desktop only. A bare 1px bar with no icon sibling, so
            nothing re-centres it away from the node centres. Hidden below lg,
            where a two-column layout would put the line across the wrong row. */}
        <div
          className="pointer-events-none absolute hidden h-px bg-gradient-to-r from-brand-accent-soft to-brand-accent lg:block"
          style={{ top: '1.75rem', left: railInset, right: railInset }}
          aria-hidden="true"
        />

        {workSteps.map((step, index) => {
          const Icon = stepIcons[index]

          return (
            <article
              key={step.number}
              className="group relative flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative flex size-14 items-center justify-center rounded-full border border-brand-border-subtle bg-white shadow-sm transition duration-300 group-hover:-translate-y-0.5 group-hover:border-brand-accent-bright group-hover:shadow-md">
                <Icon className="size-6 text-brand-accent" />
                <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-brand-surface-inverse text-[0.65rem] font-bold text-white ring-2 ring-brand-surface-sunken">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-4 max-w-[14rem] text-lg font-bold leading-snug text-brand-content">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-brand-content-muted">
                {step.description}
              </p>
            </article>
          )
        })}
      </div>

      <div className="flex justify-center pt-2" data-aos="fade-up">
        <Link
          href="/send-parcel"
          className="group inline-flex items-center gap-2 rounded-full border border-brand-content/20 bg-white px-6 py-3 font-semibold text-brand-content transition hover:border-brand-accent hover:text-brand-accent"
        >
          Book your first pickup
          <MdArrowForward className="size-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}

export default Works
