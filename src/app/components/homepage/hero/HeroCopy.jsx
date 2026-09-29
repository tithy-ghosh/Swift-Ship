import Link from 'next/link'
import { MdArrowForward, MdRoute } from 'react-icons/md'

const ROTATING_WORDS = ['on time', 'tracked', 'dependable']

/**
 * Claims are pulled from existing data, not invented.
 *
 * `48-72 hr` has to match `services.data.js`; the two files previously
 * disagreed (this said "4-6 hr", the services bento said "48-72 hours") and
 * neither number came from a configurable setting. There is no ETA field in
 * admin settings, so anything stated here has to be kept true by hand.
 *
 * `64+` matches the 64 active service centers in `warehouse.data.json`. That
 * figure was previously wrong: the district list driving the admin Service
 * Zones dropdown had 63 entries and was missing Chapainawabganj, so an admin
 * could not create a zone for a district that already had a service center.
 *
 * `COD / or pay online` is real, not aspirational: `POST
 * /api/payment/init/:parcelId` returns a gatewayUrl and the booking flow
 * redirects to it.
 */
const TRUST_POINTS = [
  { value: '64+', label: 'delivery districts' },
  { value: '48-72 hr', label: 'Dhaka & beyond' },
  { value: 'COD', label: 'or pay online' },
  { value: '24/7', label: 'parcel support' },
]


const SLOT_WORD = ROTATING_WORDS.reduce((longest, word) =>
  word.length > longest.length ? word : longest
)

/**
 * Rotating word inside the H1. Purely presentational, so it stays a server
 * component — the CSS animation handles the cycle without a JS timer.
 */
const RotatingWord = () => (
  <span className="relative inline-flex h-[1.05em] overflow-hidden align-bottom text-brand-accent">
    <span className="invisible shrink-0 whitespace-nowrap" aria-hidden="true">
      {SLOT_WORD}
    </span>
    <span className="hero-word-cycle absolute inset-x-0 flex flex-col">
      {ROTATING_WORDS.map((word) => (
        <span key={word} className="shrink-0 whitespace-nowrap leading-[1.05em]">{word}</span>
      ))}
    </span>
    {/* Screen readers get one static phrase instead of three stacked words. */}
    <span className="sr-only">{ROTATING_WORDS[0]}</span>
  </span>
)

const HeroCopy = () => {
  return (
    <div className="relative z-10 max-w-[650px]" data-aos="fade-right">
      <div className="space-y-3.5 sm:space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-surface-sunken px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-content-strong sm:text-[13px]">
          <span className="size-1.5 rounded-full bg-brand-accent" />
          Nationwide courier · 64+ districts
        </span>

        <h1 className="mx-auto max-w-2xl text-[2.1rem] font-bold leading-[1.08] tracking-tight text-brand-content sm:mx-0 sm:text-5xl lg:text-6xl">
          Parcel delivery that <RotatingWord />
        </h1>

        {/*
          Every clause here has to be true. The previous copy claimed "in under
          a minute" (the booking form is 16 fields plus a live quote and payment
          step, so no) and promised cash on delivery "anywhere in Bangladesh"
          while never mentioning online payment, which is the half that is
          actually integrated. Coverage is deliberately not repeated: the badge
          above and the 64+ stat both already carry it.
        */}
        <p className="mx-auto max-w-xl text-base leading-7 text-brand-content-muted sm:mx-0 sm:text-lg">
          Book a pickup, follow your parcel live at every step, and let customers pay
          cash on delivery or online.
        </p>
      </div>

      <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3.5">
        <Link
          href="/send-parcel"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-surface-inverse px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_rgba(31,42,29,0.22)] transition hover:bg-brand-surface-inverse-hover hover:shadow-[0_14px_34px_rgba(31,42,29,0.28)] active:scale-95"
        >
          Book a Delivery
          <MdArrowForward className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/track"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-accent/40 bg-white/70 px-6 py-3.5 text-base font-semibold text-brand-content-strong transition hover:border-brand-accent hover:bg-white active:scale-95"
        >
          {/* Route, not search. The line below already points at the nav search
            bar for looking up a tracking ID, and /track resolves into a
            "Shipment journey" timeline, so the button icon should stand for
            the journey rather than repeat the search affordance. */}
        <MdRoute className="size-5" />
          Track a Parcel
        </Link>
      </div>

      <p className="mt-3.5 text-xs text-brand-content-subtle sm:text-sm">
        Already have a tracking ID? Use the search bar in the top navigation.
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-brand-content/8 pt-5 sm:grid-cols-4 sm:gap-4">
        {TRUST_POINTS.map(({ value, label }) => (
          <div key={label} className="min-w-0 text-center sm:text-left">
            <dt className="sr-only">{label}</dt>
            <dd>
              <span className="block text-xl font-bold leading-tight text-brand-content sm:text-2xl">{value}</span>
              <span className="mt-1 block text-xs leading-4 text-brand-content-muted sm:text-[13px] sm:leading-5">{label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default HeroCopy
