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
 *
 * All four points render at every viewport. The previous mobile copy shipped
 * only three, dropping `24/7 parcel support` purely to save vertical space -
 * but a customer comparing the two halves of the site should not find that the
 * phone version promises less. Two columns is what fits the set on a phone.
 *
 * Left-aligned, not centred. These four were `text-center sm:text-left`, which
 * put the only centred content in a copy column where the badge, headline,
 * paragraph and both CTAs are all flush left. The disagreement between that one
 * row and everything above it was the most visible alignment fault on a phone.
 *
 * Removing the mobile tracking field took one of the four CTA-adjacent elements
 * off this column, so the vertical order below `sm` is now badge, headline,
 * paragraph, both CTAs, the four trust figures, and no input. Everything a
 * visitor can do is a tap away, and nothing above the artwork asks for typing.
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

/**
 * Hero copy column.
 *
 * One component, no mobile variant. Every word, claim and link here is the same
 * at every width; only the arrangement changes, and it changes at `sm`:
 *
 *  - The rotating word takes its own full-width line below `sm` and is set
 *    larger than the line above it. Stacked, the artwork has moved out of the
 *    copy column, so the type is the hero, and this is the one moment on a
 *    phone where a headline is allowed to be bigger than the nav. From `sm` up
 *    the two sit on one line as `Parcel delivery that <word>`.
 *  - The two CTAs stack full-width below `sm`. The labels are the same two, and
 *    both keep the 56px `min-h-14` touch target rather than shrinking the
 *    secondary to create a size difference - 56px is the floor for a thumb, so
 *    hierarchy comes from fill weight instead. The secondary is solid white on
 *    a `border-content/15` edge; it was `bg-white/70` with a 40%-opacity accent
 *    border, which on the cream canvas was too faint to read as a button and
 *    left the pair looking like two equal-weight slabs.
 *  - `space-y-4` rather than `3.5`. At 14px between a 32px headline and the
 *    paragraph below it, the block read as cramped on a phone.
 *
 * No tracking input at any mobile width. There was one here - `TrackField`,
 * rendering an "Enter tracking ID" box that submitted to `/track/[id]` - on the
 * reasoning that the desktop hero's tracking hint was two taps deep on a phone.
 * That is true, but the fix put a search box in the middle of a sales hero, which
 * competes with the two CTAs for the same attention and reads as a parcel
 * tracker rather than a courier. It was also the third tracking affordance on the
 * homepage, alongside the "Track a Parcel" CTA here and the `MobileActionBar`
 * button pinned to the bottom of the screen. Tracking a parcel on a phone is now
 * one tap from the CTA, which is the action people actually came for, and
 * `/track` itself opens on a full-width lookup field if they want to type an ID.
 * The file is deleted along with this reference.
 */
const HeroCopy = () => {
  return (
    <div className="relative z-10 max-w-[650px]" data-aos="fade-right">
      <div className="space-y-4 sm:space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-surface-sunken px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-content-strong sm:text-[13px]">
          <span className="size-1.5 rounded-full bg-brand-accent" />
          Nationwide courier · 64+ districts
        </span>

        <h1 className="mx-auto max-w-2xl text-[2rem] font-bold leading-[1.08] tracking-tight text-brand-content sm:mx-0 sm:text-5xl lg:text-6xl">
          Parcel delivery that{' '}
          {/* `block` below `sm` forces the word onto its own line, where it is set
              larger than the line above it. Stacked, the artwork has moved out of
              the copy column, so the type is the hero, and this is the one moment
              on a phone where a headline is allowed to be bigger than the nav.
              `sm:inline` and the explicit `sm:`/`lg:` sizes restore the original
              desktop result exactly: one line, word at the h1's own size. Note
              `text-inherit` would be wrong here - it inherits `color`. */}
          <span className="block text-[2.9rem] leading-[1.05] sm:inline sm:text-[3rem] sm:leading-[1.08] lg:text-[3.75rem]">
            <RotatingWord />
          </span>
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
          className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-brand-surface-inverse px-6 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_rgba(31,42,29,0.22)] transition hover:bg-brand-surface-inverse-hover hover:shadow-[0_14px_34px_rgba(31,42,29,0.28)] active:scale-[0.98] sm:min-h-0 sm:rounded-full sm:active:scale-95"
        >
          Book a Delivery
          <MdArrowForward className="size-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <Link
          href="/track"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-brand-content/15 bg-white px-6 py-3.5 text-base font-semibold text-brand-content-strong transition hover:border-brand-accent hover:bg-brand-surface-muted active:scale-[0.98] sm:min-h-0 sm:rounded-full sm:active:scale-95"
        >
          {/* Route, not search. The desktop hint above points at the nav search
              bar for looking up a tracking ID, and /track resolves into a
              "Shipment journey" timeline, so the button icon should stand for
              the journey rather than repeat the search affordance. */}
          <MdRoute className="size-5" />
          Track a Parcel
        </Link>
      </div>

      {/* `md`, not `sm`. This line points at the navbar search field, and that
          field is `hidden md:block` in `Navbar.jsx`, so showing the hint at 640px
          would have told a 700px-wide visitor to use a search bar that is not
          rendered yet. Keying both to the same breakpoint means the hint only
          appears where the thing it names is actually on screen. */}
      <p className="mt-3.5 hidden text-xs text-brand-content-subtle md:block md:text-sm">
        Already have a tracking ID? Use the search bar in the top navigation.
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 border-t border-brand-content/8 pt-5 sm:gap-4 sm:grid-cols-4">
        {TRUST_POINTS.map(({ value, label }) => (
          <div key={label} className="min-w-0 sm:text-left">
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
