import { FaArrowRightLong, FaCircleCheck } from 'react-icons/fa6'
import beMarchentData from '@/app/data/beMarchent.data'

/**
 * Become a merchant.
 *
 * Single column, one call to action. The old version was a two-column dark
 * panel whose right side held a "Ready to grow?" card, a three-step onboarding
 * list, and a "Pickup / Fulfill / Grow" strip. That was a second pitch
 * competing with the left column for the same message, and it ran to 121 lines
 * to say one idea.
 *
 * The section is a closing CTA rather than a process explainer, so the process
 * framing went with it. `works.jsx` already covers the delivery steps as a
 * four-node rail, and putting a competing step list here made the two read as
 * two different descriptions of the same flow.
 */
const BeMarchent = () => {
  return (
    <section
      className="overflow-hidden rounded-lg bg-brand-surface-inverse-deep text-white"
      data-aos="fade-up"
    >
      <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-8 sm:py-16">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-content-on-dark-muted/30 bg-brand-content-on-dark/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-content-on-dark-muted">
          {beMarchentData.eyebrow}
        </span>

        <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
          {beMarchentData.title}
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-white/70">
          {beMarchentData.description}
        </p>

        {/* Two stats rather than the original three. The 48h onboarding figure
            was never backed by anything in the codebase. */}
        <div className="mx-auto mt-9 grid max-w-md gap-3 sm:grid-cols-2">
          {beMarchentData.stats.map((stat) => (
            <div
              key={stat.label}
              className="border-l border-brand-accent-bright bg-white/5 px-4 py-3 text-left"
            >
              <p className="text-2xl font-bold text-brand-content-on-dark-muted">
                {stat.value}
              </p>
              <p className="mt-1 text-sm leading-5 text-white/60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {beMarchentData.benefits.map((benefit) => (
            <span
              key={benefit}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
            >
              <FaCircleCheck className="h-4 w-4 shrink-0 text-brand-accent-bright" />
              {benefit}
            </span>
          ))}
        </div>

        {/*
          KNOWN GAP: this button deliberately does not navigate.

          There is no `/be-merchant` route in the app - only `be-rider`, which
          is a different audience (couriers who drive, not merchants who ship)
          and is itself login-gated. Pointing here at `/register` or
          `/be-rider` would advertise a signup that does not exist for this
          user, so the section ends in a non-functional control until a merchant
          signup route is built. See the note in beMarchent.data.js.
        */}
        <button className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-accent-hover active:scale-95">
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
