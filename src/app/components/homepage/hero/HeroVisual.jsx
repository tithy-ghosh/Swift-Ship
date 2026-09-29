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
 */
const HeroVisual = () => {
  return (
    // A block-level element sized `width: auto` grows to fill its grid track
    // *plus* a negative right margin, so this both widens the banner and pushes
    // it into the page margin that `max-w-6xl` otherwise leaves unused. That
    // margin is ~32px at lg, ~64px at xl and ~192px at 2xl, which is exactly
    // what stops a 3:2 frame from reading as small next to a tall text column.
    // The steps stay at or inside the viewport edge, so nothing is clipped.
    <div
      className="relative mx-auto w-full max-w-sm sm:max-w-md lg:mx-0 lg:mr-[-2rem] lg:max-w-none xl:mr-[-4rem] 2xl:mr-[-9rem]"
      aria-hidden="true"
    >
      {/* Brand backdrop. Deliberately much larger than the banner and pushed up
          and to the right, so it reads as a shape behind the art rather than a
          tight outline. It grows more vertically than horizontally because a
          3/2 landscape frame has no vertical slack of its own, and it stays
          flush on the left so it never crowds the copy column. */}
      <div className="absolute -bottom-10 -left-2 -right-8 -top-8 -z-10 rounded-[46%_54%_50%_50%/58%_44%_56%_42%] bg-gradient-to-br from-brand-surface-raised via-brand-accent-mid to-brand-accent-bright/80 shadow-[0_32px_90px_rgba(77,141,65,0.3)] sm:-bottom-14 sm:-right-12 sm:-top-12 lg:-bottom-16 lg:-right-16 lg:-top-16 lg:left-0" />

      <div className="relative aspect-[3/2] w-full">
        <Image
          src={heroBanner}
          alt=""
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          priority
          sizes="(max-width: 640px) 384px, (max-width: 1024px) 448px, (max-width: 1536px) 640px, 720px"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Status chips, anchored to the frame so they never clip. */}
      <div className="hero-float pointer-events-none absolute left-0 top-[6%] flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-[0_10px_30px_rgba(31,42,29,0.16)] backdrop-blur-sm lg:-left-4">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full rounded-full bg-brand-accent opacity-70 hero-pulse-ring" />
          <span className="relative inline-flex size-2.5 rounded-full bg-brand-accent" />
        </span>
        <MdElectricBolt className="size-4 shrink-0 text-brand-accent" />
        <span className="whitespace-nowrap text-xs font-bold text-brand-content">Rider en route</span>
      </div>

      <div
        className="hero-float pointer-events-none absolute right-0 top-[44%] flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-[0_10px_30px_rgba(31,42,29,0.16)] backdrop-blur-sm lg:-right-4"
        style={{ animationDelay: '-1.8s' }}
      >
        <MdAccessTime className="size-4 shrink-0 text-brand-accent" />
        <span className="whitespace-nowrap text-xs font-bold text-brand-content">ETA 2h 14m</span>
      </div>

      <div
        className="hero-float pointer-events-none absolute bottom-0 left-[8%] flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 py-2 shadow-[0_10px_30px_rgba(31,42,29,0.16)] backdrop-blur-sm lg:-bottom-5"
        style={{ animationDelay: '-2.6s' }}
      >
        <MdCheckCircle className="size-4 shrink-0 text-brand-accent" />
        <span className="whitespace-nowrap text-xs font-bold text-brand-content">COD or online</span>
      </div>
    </div>
  )
}

export default HeroVisual
