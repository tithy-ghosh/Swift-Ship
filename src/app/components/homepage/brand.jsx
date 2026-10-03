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
      <div className="relative">
        {/* Marquee-only. The fades exist to soften the loop's hard cut-off as the
            track wraps, which is a `sm`-and-up event. Below `sm` the track is a
            static grid with nothing moving past the edge, so a fade there would
            only wash out whichever logo happened to sit in that column. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-white to-transparent sm:block sm:w-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-white to-transparent sm:block sm:w-20" />

        {/* `grid` below `sm` and `display: flex` from `sm` up, which is why the
            track looks like a two-row logo wall on a phone and a marquee on a
            desktop. The `grid` utility cannot win on its own: `display: flex`
            for these tracks lives in an unlayered `@media (min-width: 640px)`
            block in `globals.css`, and unlayered CSS beats any layered utility,
            so the flex half has to be the narrow one.

            `grid-cols-3` sizes three tiles to the row and `w-auto` on the tile
            lets them fill their column. The fixed `sm:w-40` cannot be used at
            the base, because a grid item with a resolved width leaves a dead gap
            in any column narrower than that width - three `w-36` tiles are 432px
            plus gaps, which does not fit a 375px screen. */}
        <div className="brand-marquee-track grid grid-cols-3 gap-3 sm:items-center sm:gap-6 sm:pr-6">
          {scrollingBrands.map((brand, index) => {
            // The track renders each brand twice so the loop is seamless. The
            // clone half is decorative only, so it is hidden from assistive
            // tech — otherwise every brand is announced twice.
            const isClone = index >= brands.length

            return (
              <div
                key={`${brand.name}-${index}`}
                aria-hidden={isClone || undefined}
                // Clones are `hidden` below `sm` so the grid is one copy long.
                // Restored at `sm` for the marquee, where the second copy
                // is what lets the `translate3d(-50%)` loop close. Class-based,
                // so it is right in the first paint and needs no JS.
                className={`flex h-16 w-auto shrink-0 items-center justify-center rounded-lg border border-brand-border-strong bg-brand-surface-muted px-3 shadow-sm sm:h-24 sm:w-40 sm:px-6 ${isClone ? 'hidden sm:flex' : ''}`}
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="max-h-12 w-auto object-contain"
                  // The `sm` figure is the marquee tile's fixed width. Below
                  // `sm` the tile is one grid column with no padding on the
                  // track, so it is a third of the viewport rather than a
                  // constant, and saying `144px` there made the browser fetch
                  // and reserve a wider image than the column can ever hold.
                  sizes="(min-width: 640px) 160px, 33vw"
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
