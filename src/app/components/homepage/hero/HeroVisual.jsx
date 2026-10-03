import Image from 'next/image'
import { MdAccessTime, MdCheckCircle, MdElectricBolt } from 'react-icons/md'

import heroBanner from '@/app/assets/Hero.png'

// Intrinsic size of the source asset. Declaring it on <Image> plus the 3/2
// aspect box below reserves the correct space before the file loads, so the
// banner is never stretched, cropped, or allowed to shift the layout.
const BANNER_WIDTH = 1536
const BANNER_HEIGHT = 1024

/**
 * Hero visual.
 *
 * The column is fluid, so the banner fills it and the height is derived from
 * the real 3/2 ratio. On large screens it bleeds slightly past the text column
 * to keep both sides optically balanced instead of leaving a hard right edge.
 * Decorative — the copy column already conveys this for assistive tech.
 *
 * Two arrangements from one component:
 *
 *  - Below `lg` it is full-bleed to both screen edges, sitting under the copy as
 *    one band. `-mx-4 sm:-mx-6` cancels the page gutter the hero container
 *    sets, and `max-w-none` stops the old `max-w-sm` cap from floating a small
 *    banner in the middle of a wide phone. The hero section is `overflow-hidden`
 *    below `lg`, which is what makes that breakout safe from producing a
 *    horizontal scrollbar.
 *  - `sm:aspect-[4/3]` rather than 3/2 below `lg`. A 3/2 frame edge-to-edge on a
 *    375px phone is 250px tall, which is enough; but on a short handset the
 *    taller crop survives the navbar without pushing the headline off the first
 *    screen.
 *
 * At `lg` and above every value in this file resolves back to what it was before
 * the mobile arrangement existed: `lg:mx-0` and `max-w-none` restore the original
 * width and negative right margin, `lg:aspect-[3/2]` restores the ratio, and the
 * `sm:` sizes on the chips restore the original padding and type. The desktop
 * hero is not a responsive special case of the mobile one; it is the default
 * that the mobile classes step away from.
 */
const HeroVisual = () => {
  return (
    // A block-level element sized `width: auto` grows to fill its grid track
    // *plus* a negative right margin, so this both widens the banner and pushes
    // it into the page margin that `max-w-6xl` otherwise leaves unused. That
    // margin is ~32px at lg, ~64px at xl and ~192px at 2xl, which is exactly
    // what stops a 3:2 frame from reading as small next to a tall text column.
    // The steps stay at or inside the viewport edge, so nothing is clipped.
    //
    // `-mx-4 sm:-mx-6` cancels the container gutter so the frame runs edge to
    // edge below `lg`, and `max-w-none` drops the old `max-w-sm` cap that would
    // otherwise float a small banner in the middle of a wide phone. At `lg` the
    // `mx-0`/`max-w-none` pair restores the original width and negative right
    // margin exactly.
    //
    // No `order` utility. The banner used to be promoted above the copy below
    // `lg` with `order-first`, on the theory that a full-bleed image leads well.
    // It does not: the banner is `aria-hidden` decoration, so putting it first
    // buried the headline, the two CTAs and the tracking field - the only parts
    // of the hero a visitor can act on. `hero.jsx` already lists `HeroCopy`
    // before `HeroVisual`, so dropping the override makes the copy lead at every
    // width and the banner read as one band directly under the message.
    <div
      className="relative -mx-4 w-full max-w-none sm:-mx-6 lg:mx-0 lg:mr-[-2rem] xl:mr-[-4rem] 2xl:mr-[-9rem]"
      aria-hidden="true"
    >
      {/* No gradient backdrop. There used to be a large blob here - a
          `bg-gradient-to-br from-brand-surface-raised via-brand-accent-mid
          to-brand-accent-bright/80` shape with a `rgba(77,141,65, 0.3)` green
          shadow, sitting behind and past the edges of the banner. It was meant
          to read as a brand shape rather than a tight outline, but a 3/2 frame
          has no vertical slack of its own, so the shape never read as separate
          from the art: it just washed the edges of the banner green and
          shifted the colour temperature of the whole hero. The banner carries
          its own colour, and the status chips below are the only overlay. If a
          backdrop is ever wanted again it needs to be either a flat tone well
          clear of the frame, or keyed to a real gap in the artwork. */}

      <div className="relative aspect-[3/2] w-full sm:aspect-[4/3] lg:aspect-[3/2]">
        <Image
          src={heroBanner}
          alt=""
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          /*
            `priority` is correct here again, and this comment is the record of
            why it was not before.

            The banner used to live inside a desktop-only tree
            (`hidden lg:block`), with a separate `MobileHero` for phones.
            `priority` emits a `<link rel=preload>` in the head, which is not
            conditional on media queries, so a phone would have downloaded the
            desktop banner it never paints - hence `loading="lazy"` and a real
            LCP cost on cold desktop loads.

            `hero.jsx` is now a single component rendered once at the top of the
            page. There is only one banner in the DOM and it is the LCP element
            at every width, so preloading it is a straight win again.

            `sizes` is the width of the frame at each breakpoint. Only the first
            entry is new: below `lg` the frame is edge-to-edge, so it tracks
            `100vw` where the old `max-w-sm` cap had made it a fixed 384px. Both
            desktop entries are unchanged from the original, because the `lg`
            geometry did not change.
          */
          priority
          sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 640px, 720px"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Status chips, anchored to the frame so they never clip.

          Horizontal inset below `lg`, tighter padding and type below `sm`. The
          inset matters because the frame is edge-to-edge on a phone, so
          anchoring at `left-0`/`right-0` put two chips flush against the screen
          edge and the third at a `6%` offset - three different distances from the
          edge, which read as accidental rather than as three pins on a frame.
          They now sit on the artwork with a consistent margin, and `lg:` restores
          the original negative offsets so the desktop bleed is unchanged. */}
      <div className="hero-float pointer-events-none absolute left-3 top-[6%] flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-2.5 py-1.5 shadow-[0_10px_30px_rgba(31,42,29,0.16)] backdrop-blur-sm sm:left-4 sm:gap-2 sm:px-3 sm:py-2 lg:-left-4">
        <span className="relative flex size-2 sm:size-2.5">
          <span className="absolute inline-flex size-full rounded-full bg-brand-accent opacity-70 hero-pulse-ring" />
          <span className="relative inline-flex size-2 rounded-full bg-brand-accent sm:size-2.5" />
        </span>
        <MdElectricBolt className="size-3.5 shrink-0 text-brand-accent sm:size-4" />
        <span className="whitespace-nowrap text-[11px] font-bold text-brand-content sm:text-xs">Rider en route</span>
      </div>

      <div
        className="hero-float pointer-events-none absolute right-3 top-[44%] flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-2.5 py-1.5 shadow-[0_10px_30px_rgba(31,42,29,0.16)] backdrop-blur-sm sm:right-4 sm:gap-2 sm:px-3 sm:py-2 lg:-right-4"
        style={{ animationDelay: '-1.8s' }}
      >
        <MdAccessTime className="size-3.5 shrink-0 text-brand-accent sm:size-4" />
        <span className="whitespace-nowrap text-[11px] font-bold text-brand-content sm:text-xs">ETA 2h 14m</span>
      </div>

      <div
        className="hero-float pointer-events-none absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/80 bg-white/90 px-2.5 py-1.5 shadow-[0_10px_30px_rgba(31,42,29,0.16)] backdrop-blur-sm sm:bottom-0 sm:left-[8%] sm:gap-2 sm:px-3 sm:py-2 lg:-bottom-5"
        style={{ animationDelay: '-2.6s' }}
      >
        <MdCheckCircle className="size-3.5 shrink-0 text-brand-accent sm:size-4" />
        <span className="whitespace-nowrap text-[11px] font-bold text-brand-content sm:text-xs">COD or online</span>
      </div>
    </div>
  )
}

export default HeroVisual
