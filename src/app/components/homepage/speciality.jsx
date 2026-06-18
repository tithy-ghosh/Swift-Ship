import Image from 'next/image'
import specialities from '@/app/data/speciality.data'

const Speciality = () => {
  return (
    <section className="overflow-hidden rounded-lg bg-[#f7faf4] px-4 py-10 sm:px-8 sm:py-12 lg:px-10">
      <div className="mx-auto mb-10 max-w-3xl text-center" data-aos="fade-up">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4d8d41]">
          Why SwiftShip
        </p>
        <h2 className="mt-3 text-2xl font-bold leading-tight text-[#1f2a1d] sm:text-4xl">
          Special care for every parcel
        </h2>
      </div>

      <div className="space-y-6">
        {specialities.map((item, index) => (
          <article
            key={item.title}
            className="grid items-center gap-6 rounded-lg border border-[#dbead5] bg-white p-4 shadow-sm sm:p-8 lg:grid-cols-[220px_minmax(0,1fr)]"
            data-aos="fade-up"
            data-aos-delay={index * 120}
          >
            <div className="flex h-40 w-full items-center justify-center rounded-lg bg-[#eef7ea] p-4 sm:h-48 lg:w-56">
              <Image
                src={item.image}
                alt={item.imageAlt}
                className="h-full max-h-36 w-auto max-w-full object-contain sm:max-h-40"
                priority={index === 0}
              />
            </div>

            <div className="max-w-xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#4d8d41]">
                {item.eyebrow}
              </p>
              <h3 className="mt-3 text-xl font-bold leading-tight text-[#1f2a1d] sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-[#596257]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Speciality
