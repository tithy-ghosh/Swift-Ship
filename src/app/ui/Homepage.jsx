import React from 'react'
import Hero from '@/app/components/hero'
import Works from '@/app/components/works'
import OurServices from '@/app/components/ourServices'
import Brand from '@/app/components/brand'
import Speciality from '@/app/components/speciality'
import BeMarchent from '@/app/components/beMarchent'
import Reviews from '@/app/components/reviews'

const Homepage = () => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:gap-16 sm:px-6 lg:gap-20 lg:px-8">
      <Hero />
      <Works />
      <OurServices />
      <Brand />
      <Speciality />
      <BeMarchent />
      <Reviews />
    </div>
  )
}

export default Homepage
