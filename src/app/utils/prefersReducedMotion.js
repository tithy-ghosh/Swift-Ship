/**
 * Reads the OS-level "reduce motion" accessibility setting.
 *
 * SSR-safe: `window` does not exist during the server render, so this returns
 * false there. That is deliberate — the server must never emit a different
 * markup than the client, otherwise hydration mismatches.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default prefersReducedMotion;
