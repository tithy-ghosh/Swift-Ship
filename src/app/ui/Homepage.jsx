import React from 'react'
import Hero from '@/components/hero'
import Works from '@/components/works'

const Homepage = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-20 px-5"
    style={{
      "gap": "5rem"
    }}
    >
      <Hero />
      <Works />
    </div>
  )
}

export default Homepage
