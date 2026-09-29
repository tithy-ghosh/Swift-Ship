import React from 'react'
import Link from 'next/link'
import { MdDescription, MdInventory2, MdAddCircleOutline, MdArrowForward } from 'react-icons/md'

const tiers = [
  {
    icon: MdDescription,
    title: 'Documents',
    price: '৳50 – ৳80',
    note: '৳50 within city · ৳80 outside city',
    blurb: 'Letters, papers, and other lightweight document envelopes.',
  },
  {
    icon: MdInventory2,
    title: 'Parcels up to 3kg',
    price: '৳80 – ৳130',
    note: '৳80 within city · ৳130 outside city',
    blurb: 'Standard non-document parcels, boxes, and packages.',
  },
  {
    icon: MdAddCircleOutline,
    title: 'Extra weight',
    price: '+৳20 / kg',
    note: 'Plus ৳20 outside-city surcharge',
    blurb: 'For anything heavier than 3kg, charged per additional kilogram.',
  },
]

const PricingTiers = () => {
  return (
    <section
      className="relative overflow-hidden rounded-[2.5rem] bg-brand-surface-inverse px-6 py-10 text-white sm:px-10 sm:py-12 lg:rounded-r-[6rem]"
      data-aos="fade-up"
    >
      {/* decorative dots */}
      <div className="pointer-events-none absolute -right-6 top-8 hidden grid-cols-3 gap-2 sm:grid">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="size-1.5 rounded-full bg-white/20" />
        ))}
      </div>

      <div className="mb-8 flex flex-col gap-2 text-center sm:text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent-bright">
          Simple, transparent pricing
        </p>
        <h2 className="text-2xl font-bold sm:text-3xl">What it costs to ship with SwiftShip</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {tiers.map(({ icon: Icon, title, price, note, blurb }) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand-accent-bright/20">
              <Icon className="size-6 text-brand-accent-bright" />
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-2xl font-bold text-brand-accent-bright">{price}</p>
            <p className="text-xs text-white/50">{note}</p>
            <p className="text-sm leading-6 text-white/70">{blurb}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:justify-start">
        <Link
          href="/send-parcel"
          className="inline-flex items-center gap-2 rounded-full bg-brand-accent-bright px-6 py-3 font-semibold text-brand-surface-inverse-deep shadow-md transition hover:bg-brand-accent-hover active:scale-95"
        >
          Get a Quote
          <MdArrowForward className="size-5" />
        </Link>
      </div>
    </section>
  )
}

export default PricingTiers