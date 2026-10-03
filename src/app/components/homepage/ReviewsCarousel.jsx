'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { prefersReducedMotion } from '@/app/utils/prefersReducedMotion'

/**
 * Carousel shell for the review cards.
 *
 * The shell owns the scroller and the arrows and nothing else. It takes the
 * cards as `children` and never inspects them, which is what lets `reviews`
 * stay a server component: a server component may hand rendered JSX to a client
 * one, so the eight cards are still rendered on the server and only this shell
 * hydrates. Adding `'use client'` to `reviews` itself would work too and is one
 * line shorter, but it would ship hydration JS for eight cards that have no
 * behaviour of their own.
 *
 * Below `sm` the track is a horizontal scroll-snap row the reader drives. From
 * `sm` it is the auto-advancing marquee, which is why the arrows are `sm:hidden`
 * - a marquee has no end to scroll to, so they would be dead controls.
 *
 * The track deliberately keeps the plain `reviews-marquee-track` class rather
 * than re-declaring the scroller as utilities. All of the scroll behaviour
 * (`overflow-x`, `scroll-snap-type`, `scroll-snap-align`, the hidden scrollbar,
 * `overscroll-behavior-x`) already lives on that class in `globals.css`, and the
 * `min-width: 640px` half of it is what hands the same element over to the
 * marquee. Duplicating those as utilities here would put two sources of truth on
 * one element and risk the utilities winning at `sm` and cancelling the
 * animation.
 */
const ReviewsCarousel = ({ children }) => {
  const trackRef = useRef(null)

  /*
    Both flags are seeded for the phone case rather than the marquee case: below
    `sm` the track always overflows, so seeding them this way means the arrows
    are correct in the first paint instead of flashing disabled until the effect
    runs. At `sm` and up the effect flips both to false, which is invisible
    because the arrow row is `sm:hidden`.
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
    a constant, because the card width is responsive (`w-[260px] sm:w-[340px]`).
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
    'flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-border-subtle bg-white text-brand-content-strong transition active:scale-95 disabled:pointer-events-none disabled:opacity-30'

  return (
    <div>
      <div
        ref={trackRef}
        className="reviews-marquee-track flex items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5"
      >
        {children}
      </div>

      {/*
        `sm:hidden`: from `sm` the track is the marquee, which has no overflow to
        scroll, so the arrows would be dead controls there.

        The arrows sit under the row rather than over it so they never cover a
        card, and they are centred to match the services carousel. `size-11`
        (44px) is the minimum comfortable touch target.
      */}
      <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={!canScrollBack}
          aria-label="Scroll reviews back"
          className={arrowClass}
        >
          <FaChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={!canScrollForward}
          aria-label="Scroll reviews forward"
          className={arrowClass}
        >
          <FaChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

export default ReviewsCarousel
