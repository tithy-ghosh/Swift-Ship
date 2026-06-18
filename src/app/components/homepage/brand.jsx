import Image from 'next/image'
import brands from '@/app/data/brand.data'

const Brand = () => {
  const scrollingBrands = [...brands, ...brands]

  return (
    <section
      className="overflow-hidden rounded-lg border border-[#dbead5] bg-white py-8 sm:py-10"
      data-aos="fade-up"
    >
      
       <div className="mx-auto mb-6 flex max-w-3xl flex-col items-center gap-3 px-4 text-center sm:mb-8">
        
        <h2 className="text-2xl font-bold leading-tight text-[#1f2a1d] sm:text-3xl">
          Companies moving faster with SwiftShip
        </h2>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-20" />

        <div className="brand-marquee-track flex items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
          {scrollingBrands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex h-20 w-36 shrink-0 items-center justify-center rounded-lg border border-[#e3efde] bg-[#f7faf4] px-4 shadow-sm sm:h-24 sm:w-44 sm:px-6"
            >
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="max-h-12 w-auto object-contain"
                sizes="176px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Brand
