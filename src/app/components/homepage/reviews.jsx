import Image from 'next/image'
import { FaStar } from 'react-icons/fa6'
import reviews from '@/app/data/reviews.data'

const Reviews = () => {
  const scrollingReviews = [...reviews, ...reviews]

  return (
    <section
      className="overflow-hidden rounded-lg bg-white px-4 py-10 shadow-sm sm:px-8 sm:py-12 lg:px-10"
      data-aos="fade-up"
    >
      <div className="mx-auto mb-10 flex max-w-3xl flex-col items-center gap-4 text-center">
        <div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border-subtle bg-brand-surface-muted px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
            Customer stories
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-brand-content sm:text-4xl">
            Trusted by growing local sellers
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-7 text-brand-content-muted">
          Merchants use SwiftShip to keep deliveries visible, support faster,
          and parcel handling more dependable from pickup to doorstep.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

        <div className="reviews-marquee-track flex items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5">
          {scrollingReviews.map((review, index) => {
            // Same as the brand marquee: the second copy exists only to make
            // the loop seamless, so it must not be read out twice.
            const isClone = index >= reviews.length

            return (
              <article
                key={`${review.name}-${index}`}
                aria-hidden={isClone || undefined}
                className="relative flex min-h-[300px] w-[260px] shrink-0 flex-col rounded-lg border border-brand-border-subtle bg-brand-surface-muted p-4 sm:w-[340px] sm:p-5"
              >
                <div className="mb-6 flex items-center gap-4">
                  <Image
                    src={review.image}
                    alt={`${review.name} profile image`}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-brand-content">{review.name}</h3>
                    <p className="mt-1 text-sm leading-5 text-brand-content-muted">
                      {review.role}
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex gap-1 text-brand-accent">
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <FaStar key={starIndex} className="h-4 w-4" />
                  ))}
                </div>

                <p className="text-base leading-7 text-brand-content-strong">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Reviews
