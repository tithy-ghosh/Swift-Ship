"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/app/utils/prefersReducedMotion";

/**
 * Counts 0 -> `target` on an ease-out cubic, once `start` becomes true.
 *
 * The reduced-motion branch used to call setValue(target) inside the effect,
 * which is a synchronous setState in an effect and tripped
 * `react-hooks/set-state-in-effect`. Returning the target during render instead
 * keeps the same behaviour with no extra render pass and no lint suppression.
 *
 * @param {number} target        Final value.
 * @param {boolean} start        Gate — usually an `useInView` flag.
 * @param {number} [duration=1600] Milliseconds.
 * @returns {number}
 */
export function useCountUp(target, start, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    // Reduced motion is handled by the render-time early return below, so the
    // animation loop is simply never started.
    if (prefersReducedMotion()) return;

    let raf;
    let t0;

    const tick = (t) => {
      if (t0 === undefined) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);

  if (prefersReducedMotion()) return target;
  return value;
}

export default useCountUp;
