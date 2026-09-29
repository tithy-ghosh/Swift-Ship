"use client";

import { useEffect, useState } from "react";

/**
 * One-shot "has this element entered the viewport" flag.
 *
 * Used by the homepage NetworkMap stats so the count-up only animates once the
 * section is actually on screen — numbers sitting at 0 below the fold look
 * broken if the user scrolls slowly, and animating off-screen is wasted work.
 *
 * Latches: after the first intersection the observer disconnects and never
 * re-arms, because these sections only need the transition to fire once. It does
 * not track visibility, so scrolling back up does not reset the counter.
 *
 * @param {{ current: Element | null }} ref
 * @param {number} [threshold=0.25] Fraction of the element that must be visible.
 * @returns {boolean}
 */
export function useInView(ref, threshold = 0.25) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [ref, seen, threshold]);

  return seen;
}

export default useInView;
