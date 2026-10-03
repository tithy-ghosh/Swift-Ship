'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { prefersReducedMotion } from '@/app/utils/prefersReducedMotion'

/**
 * Carousel shell for the service cards.
 *
 * The shell owns the scroller and the arrows and nothing else. It takes the
 * cards as `children` and never inspects them, which is what lets `ourServices`
 * stay a server component: a server component may hand rendered JSX to a client
 * one, so the six cards are still rendered on the server and only this shell
 * hydrates. Adding `'use client'` to `ourServices` itself would work too and is
 * one line shorter, but it would ship hydration JS for six cards that have no
 * behaviour of their own.
 *
 * Below `md` the track is a horizontal scroll-snap row, because six stacked
 * cards pushed the pricing panel three screens down and a phone user had to
 * scroll past the whole section to find out what was in it. From `md` it is the
 * bento grid, where there is nothing to scroll.
 *
 * `md:grid` on the track is load-bearing rather than cosmetic. `display` is the
 * one property here that has to change at the breakpoint, and Tailwind's
 * `md:grid` is what does it - a `display: flex` written in a stylesheet would
 * win over the layered utility and keep the row a row at desktop widths, which
 * would collapse the featured tile's 2x2 span.
 *
 * The snap properties are left unconditioned at `md` and up instead of being
 * wrapped in a `max-width` query. A grid that does not overflow has no scroll
 * port to snap against, so they are inert, and an `overflow-x: auto` that never
 * overflows costs nothing. See the same reasoning in the marquee block below.
 */
const ServicesCarousel = ({ children }) => {
  const trackRef = useRef(null)

  /*
    Both flags are seeded for the phone case rather than for the grid case: below
    `md` the track always overflows, so seeding them this way means the arrows
    are correct in the first paint instead of flashing disabled until the effect
    runs. At `md` and up the effect flips both to false, which is invisible
    because the arrow row is `md:hidden`.
  */
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollForward, setCanScrollForward] = useState(true)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const update = () => {
      // The `1` slack absorbs fractional device pixels, so the arrow does not
      // stay enabled for a sub-pixel of travel left at the end of the row.
      const max = track.scrollWidth - track.clientWidth
      setCanScrollBack(track.scrollLeft > 1)
      setCanScrollForward(track.scrollLeft < max - 1)
    }

    update()
    track.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      track.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  /*
    One card per press, so the arrow and the swipe agree on what a step is.

    The step is measured from the first card plus the flex gap rather than being
    a constant, because the card basis is responsive (`w-[85%] max-w-[21rem]`).
    Measuring it means changing that width, or the `gap`, cannot silently
    desync the arrow from the snap point.
  */
  const scrollByCard = useCallback((direction) => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!track || !card) return

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    track.scrollBy({
      left: (card.getBoundingClientRect().width + gap) * direction,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [])

  const arrowClass =
    'flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-border-subtle bg-white text-brand-content-strong transition active:scale-95 disabled:pointer-events-none disabled:opacity-30'

  return (
    <div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain no-scrollbar md:grid md:auto-rows-[16rem] md:grid-cols-2 lg:grid-cols-3"
      >
        {children}
      </div>

      {/*
        `md:hidden`: from `md` the track is the bento grid, which has no overflow
        to scroll, so the arrows would be dead controls there.

        `overscroll-x-contain` on the track is what stops a horizontal swipe that
        runs off the end of the row from chaining into the page's vertical
        scroll, which is the usual complaint about touch carousels.
      */}
      <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollBack}
          aria-label="Scroll services back"
          className={arrowClass}
        >
          <FaChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canScrollForward}
          aria-label="Scroll services forward"
          className={arrowClass}
        >
          <FaChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

export default ServicesCarousel