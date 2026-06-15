import React from 'react'
import Hero from '@/components/hero'
import Works from '@/components/works'
import OurServices from '@/components/ourServices'
import Brand from '@/components/brand'

const Homepage = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-5 sm:gap-20">
      <Hero />
      <Works />
      <OurServices />
      <Brand />
    </div>
  )
}

export default Homepage
