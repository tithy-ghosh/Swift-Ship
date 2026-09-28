import React from 'react'
import HeroCopy from './hero/HeroCopy'
import HeroVisual from './hero/HeroVisual'

/**
 * Homepage hero.
 *
 * No padding or max-width here on purpose — `Homepage` already owns the
 * container, the gutters and the top offset that clears the fixed navbar.
 * Repeating them stacked up to 200px of dead space above the fold.
 */
const Hero = () => {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
      <HeroCopy />
      <HeroVisual />
    </section>
  )
}

export default Hero
