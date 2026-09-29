import Image from 'next/image'
import specialities from '@/app/data/speciality.data'

/**
 * Why SwiftShip.
 *
 * Three differentiators in a three-up grid rather than three stacked
 * full-width rows. The stacked version repeated the same 220px-image-left,
 * text-right pattern three times at identical weight, which read as filler and
 * cost about 600px of scroll to say three short things.
 *
 * The grid also does not duplicate a pattern used elsewhere on the page:
 * `ourServices` is an asymmetric bento and `works` is a connected rail. An even
 * three-up is deliberately plainer than both.
 */
const Speciality = () => {
  return (
    <section className="overflow-hidden rounded-2xl bg-brand-surface-sunken px-4 py-10 sm:px-8 sm:py-12 lg:px-10">
      <div className="mx-auto mb-10 max-w-3xl text-center" data-aos="fade-up">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border-subtle bg-brand-surface px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
          Why SwiftShip
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-tight text-brand-content sm:text-4xl">
          Care that doesn&rsquo;t stop at pickup.
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {specialities.map((item, index) => (
          <article
            key={item.title}
            className="flex flex-col rounded-2xl border border-brand-border-subtle bg-brand-surface p-5 shadow-sm sm:p-6"
            data-aos="fade-up"
            data-aos-delay={index * 120}
          >
            <div className="flex h-32 items-center justify-center rounded-xl bg-brand-surface-sunken p-4 sm:h-36">
              <Image
                src={item.image}
                alt={item.imageAlt}
                className="h-full max-h-24 w-auto max-w-full object-contain"
              />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
              {item.eyebrow}
            </p>
            <h3 className="mt-2 text-lg font-bold leading-snug text-brand-content sm:text-xl">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-brand-content-muted">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Speciality
