import { FaCircleCheck } from 'react-icons/fa6';
import MerchantApplicationForm from '@/app/components/merchants/MerchantApplicationForm';
import beMarchentData from '@/app/data/beMarchent.data';

export const metadata = {
  title: 'Become a Merchant | SwiftShip',
  description:
    'Apply to ship with SwiftShip: pickup scheduling, COD and returns, live tracking, and one dashboard for every order.',
};

export default function BeMerchantPage() {
  return (
    <main className="min-h-screen bg-brand-surface-muted px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-border-subtle bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">
            {beMarchentData.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-content sm:text-4xl">
            {beMarchentData.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-brand-content-muted">
            {beMarchentData.description}
          </p>

          <ul className="mt-5 flex flex-wrap justify-center gap-2">
            {beMarchentData.benefits.map((benefit) => (
              <li
                key={benefit}
                className="inline-flex items-center gap-2 rounded-full border border-brand-border-subtle bg-white px-3 py-1.5 text-sm text-brand-content"
              >
                <FaCircleCheck className="size-4 shrink-0 text-brand-accent" />
                {benefit}
              </li>
            ))}
          </ul>
        </header>

        <MerchantApplicationForm />
      </div>
    </main>
  );
}
