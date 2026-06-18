import React from 'react'
import Hero from '@/app/components/homepage/hero'
import Works from '@/app/components/homepage/works'
import OurServices from '@/app/components/homepage/ourServices'
import Brand from '@/app/components/homepage/brand'
import Speciality from '@/app/components/homepage/speciality'
import BeMarchent from '@/app/components/homepage/beMarchent'
import Reviews from '@/app/components/homepage/reviews'

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
