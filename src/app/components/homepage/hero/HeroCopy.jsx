import Link from 'next/link'
import { MdArrowForward, MdSearch } from 'react-icons/md'

const ROTATING_WORDS = ['on time', 'tracked', 'COD ready']

/** Claims are pulled from existing data, not invented. */
const TRUST_POINTS = [
  { value: '64+', label: 'delivery districts' },
  { value: '4–6 hr', label: 'Dhaka express' },
  { value: '100%', label: 'cash on delivery' },
  { value: '24/7', label: 'parcel support' },
]

/**
 * Rotating word inside the H1. Purely presentational, so it stays a server
 * component — the CSS animation handles the cycle without a JS timer.
 */
const RotatingWord = () => (
  <span className="relative inline-flex h-[1.05em] w-[4.6em] overflow-hidden align-bottom text-[#4d8d41]">
    <span className="hero-word-cycle absolute inset-x-0 flex flex-col">
      {ROTATING_WORDS.map((word) => (
        <span key={word} className="shrink-0 leading-[1.05em]">{word}</span>
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
        <span className="inline-flex items-center gap-2 rounded-full border border-[#4d8d41]/20 bg-[#eef7eb] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#31542b] sm:text-[13px]">
          <span className="size-1.5 rounded-full bg-[#4d8d41]" />
          Nationwide courier · 64+ districts
        </span>

        <h1 className="mx-auto max-w-2xl text-[2.1rem] font-bold leading-[1.08] tracking-tight text-[#1f2a1d] sm:mx-0 sm:text-5xl lg:text-6xl">
          Parcel delivery that{' '}
          <RotatingWord />
          <span>.</span>
        </h1>

        <p className="mx-auto max-w-xl text-base leading-7 text-[#596257] sm:mx-0 sm:text-lg">
          Book a pickup in under a minute, follow your parcel live at every step, and pay
          cash on delivery anywhere in Bangladesh.
        </p>
      </div>

      <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3.5">
        <Link
          href="/send-parcel"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#1f2a1d] px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_rgba(31,42,29,0.22)] transition hover:bg-[#31422d] hover:shadow-[0_14px_34px_rgba(31,42,29,0.28)] active:scale-95"
        >
          Book a Delivery
          <MdArrowForward className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/track"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-[#4d8d41]/40 bg-white/70 px-6 py-3.5 text-base font-semibold text-[#31542b] transition hover:border-[#4d8d41] hover:bg-white active:scale-95"
        >
          <MdSearch className="size-5" />
          Track a Parcel
        </Link>
      </div>

      <p className="mt-3.5 text-xs text-[#8c9385] sm:text-sm">
        Already have a tracking ID? Use the search bar in the top navigation.
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-[#1f2a1d]/8 pt-5 sm:grid-cols-4 sm:gap-4">
        {TRUST_POINTS.map(({ value, label }) => (
          <div key={label} className="min-w-0 text-center sm:text-left">
            <dt className="sr-only">{label}</dt>
            <dd>
              <span className="block text-xl font-bold leading-tight text-[#1f2a1d] sm:text-2xl">{value}</span>
              <span className="mt-1 block text-xs leading-4 text-[#596257] sm:text-[13px] sm:leading-5">{label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default HeroCopy
