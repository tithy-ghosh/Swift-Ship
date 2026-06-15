'use client'

import AOS from 'aos'
import { useEffect } from 'react'

const AosInit = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
    })
  }, [])

  return null
}

export default AosInit
