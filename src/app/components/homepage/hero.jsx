import React from 'react'
import HeroCopy from './hero/HeroCopy'
import HeroVisual from './hero/HeroVisual'

/**
 * Homepage hero.
 *
 * One component for every viewport, rendered once from `page.jsx` rather than
 * once per tree. It used to exist twice - `Hero` inside the desktop tree and a
 * separate `MobileHero` inside the mobile tree - and the second copy had already
 * drifted: it dropped the "Track a Parcel" CTA, the 24/7 trust point, and the
 * whole visual, so the two halves of the site were selling different products
 * from the same URL. Duplicating a hero to lay it out differently is the wrong
 * trade; the arrangement below is what actually changes by breakpoint.
 *
 * Owns its own container. `Homepage` also has one, and this section used to sit
 * inside it. It cannot any more: on mobile the visual is full-bleed and has to
 * escape the page gutters, which a `max-w-6xl` ancestor would clip.
 *
 * No ambient colour behind the artwork. There were two green washes here - a
 * blurred `bg-brand-accent-soft/35` circle for mobile, and a larger gradient blob
 * inside `HeroVisual` - and they sat directly behind the banner, tinting it. The
 * hero now has exactly one background, `brand-canvas`, and the banner is the only
 * thing in it that carries colour. That also removed the need for `isolate` on
 * the section, which only existed to trap their `-z-10`.
 *
 * The copy leads at every width, including phones. `HeroCopy` is first in the
 * markup and nothing reorders it, so the reading order is the same stacked as it
 * is side by side: badge, headline, paragraph, both CTAs, the tracking field,
 * the trust figures, then the artwork as a full-bleed band underneath.
 *
 * This was not the first arrangement. The banner was briefly promoted above the
 * copy on mobile with `order-first`, on the theory that a large image leads well.
 * It is the wrong thing to lead with: the banner is `aria-hidden` decoration,
 * while the headline, the two CTAs and the tracking field are the entire
 * actionable content of the section. Putting decoration first on a small screen
 * pushes the actual offer below the fold. The banner is now large and
 * edge-to-edge, but it is the thing you land on after reading.
 *
 * Breakpoints, and why each one:
 *
 *  - `gap-10 lg:grid-cols-[0.9fr_1.1fr]` - stacked below `lg`, side by side above.
 *  - `pt-24 sm:pt-28` - clears the fixed translucent navbar, which floats over
 *    this section at every width.
 *  - `pb-8 sm:pb-12 lg:pb-20` - the gap to the first section. `Homepage`'s
 *    `gap-*` flex column used to supply it, back when the hero was a member of
 *    that stack; it no longer is, so the space is owned here. On mobile this is
 *    what separates the band of artwork from the section beneath it.
 *  - `overflow-hidden` below `lg` only, so the `-mx-4`/`sm:-mx-6` breakout can
 *    never become a horizontal scrollbar. It is reset at `lg` because from there
 *    the visual deliberately bleeds right into the page margin via its negative
 *    `lg:mr-*`, and the original section clipped nothing.
 */
const Hero = () => {
  return (
    <section className="overflow-hidden lg:overflow-visible">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-8 pt-24 sm:gap-12 sm:px-6 sm:pb-12 sm:pt-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-8 lg:pb-20">
        <HeroCopy />
        <HeroVisual />
      </div>
    </section>
  )
}

export default Hero
