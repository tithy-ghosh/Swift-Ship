import Image from 'next/image'
import brands from '@/app/data/brand.data'

const Brand = () => {
  const scrollingBrands = [...brands, ...brands]

  return (
    <section
      className="overflow-hidden rounded-lg border border-brand-border-subtle bg-white py-8 sm:py-10"
      data-aos="fade-up"
    >
      <div className="mx-auto mb-6 flex max-w-3xl flex-col items-center px-4 text-center sm:mb-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border-subtle bg-brand-surface-muted px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
          Trusted by
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-tight text-brand-content sm:text-4xl">
          The brands that ship with SwiftShip
        </h2>
      </div>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent sm:w-20" />

        <div className="brand-marquee-track flex items-center gap-4 pr-4 sm:gap-6 sm:pr-6">
          {scrollingBrands.map((brand, index) => {
            // The track renders each brand twice so the loop is seamless. The
            // clone half is decorative only, so it is hidden from assistive
            // tech — otherwise every brand is announced twice.
            const isClone = index >= brands.length

            return (
              <div
                key={`${brand.name}-${index}`}
                aria-hidden={isClone || undefined}
                className="flex h-20 w-36 shrink-0 items-center justify-center rounded-lg border border-brand-border-strong bg-brand-surface-muted px-4 shadow-sm sm:h-24 sm:w-40 sm:px-6"
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="max-h-12 w-auto object-contain"
                  sizes="(min-width: 640px) 160px, 144px"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Brand
