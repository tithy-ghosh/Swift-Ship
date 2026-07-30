'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  MdArrowForward,
  MdCheckCircle,
  MdCreditCard,
  MdErrorOutline,
  MdLocalAtm,
  MdOutlinePayments,
  MdReceiptLong,
  MdSchedule,
} from 'react-icons/md'
import useAuth from '@/app/hooks/useAuth'
// ✅ Import the clean API function (no token parameter needed)
import { getMyPaymentHistory } from '@/features/parcels/api/parcelApi'

const STATUS_STYLES = {
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  failed: 'bg-rose-50 text-rose-700 ring-rose-200',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-200',
}

const formatMoney = (amount) =>
  `৳${Number(amount || 0).toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const formatDate = (value) => {
  if (!value) return 'Not completed'
  return new Intl.DateTimeFormat('en-BD', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const PaymentHistorySkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="grid gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-slate-200/70" />)}
    </div>
    <div className="h-80 rounded-2xl bg-slate-200/70" />
  </div>
)

export default function PaymentHistoryPage() {
  const { user } = useAuth()
  
  // ✅ CLEANED UP: No more manual token fetching!
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['payments', 'history', user?.uid],
    queryFn: () => getMyPaymentHistory(), // ✅ Just call the function directly
    enabled: Boolean(user),
  })

  const payments = data?.payments || []
  const totalTransactions = data?.pagination?.total ?? payments.length
  const totalPaid = data?.summary?.totalPaid ?? 0
  const completedPayments = data?.summary?.completedPayments ?? 0

  return (
    <main className="space-y-7 text-[#1f2a1d]">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#4d8d41]">My account</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Payment history</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#596257]">
            Review payments connected to parcels booked from your SwiftShip account.
          </p>
        </div>
        
      </header>

      {isLoading ? (
        <PaymentHistorySkeleton />
      ) : isError ? (
        <section className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <MdErrorOutline className="mx-auto size-10 text-rose-500" />
          <h2 className="mt-3 text-lg font-black">Could not load payment history</h2>
          <p className="mt-1 text-sm text-slate-500">{error?.message || 'Please try again.'}</p>
          <button type="button" onClick={() => refetch()} className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">
            Try again
          </button>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#dce8d8] bg-white p-5 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#edf7ea] text-[#4d8d41]">
                <MdOutlinePayments className="size-5" />
              </span>
              <p className="mt-4 text-2xl font-black">{formatMoney(totalPaid)}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Total paid</p>
            </div>
            <div className="rounded-2xl border border-[#dce8d8] bg-white p-5 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MdReceiptLong className="size-5" />
              </span>
              <p className="mt-4 text-2xl font-black">{totalTransactions}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Transactions</p>
            </div>
            <div className="rounded-2xl border border-[#dce8d8] bg-white p-5 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <MdSchedule className="size-5" />
              </span>
              <p className="mt-4 text-2xl font-black">{completedPayments}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Completed payments</p>
            </div>
          </section>

          {payments.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-[#cbdac7] bg-white px-6 py-14 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#edf7ea] text-[#4d8d41]">
                <MdReceiptLong className="size-7" />
              </span>
              <h2 className="mt-4 text-xl font-black">No payments yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#596257]">
                Payments will appear here after you book a parcel with SwiftShip.
              </p>
              <Link href="/send-parcel" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#83BD75] px-4 py-2.5 text-sm font-black text-[#172015]">
                Send a parcel <MdArrowForward className="size-4" />
              </Link>
            </section>
          ) : (
            <section className="overflow-hidden rounded-2xl border border-[#dce8d8] bg-white shadow-sm">
              <div className="border-b border-[#e8f0e5] px-5 py-4 sm:px-6">
                <h2 className="font-black">Transactions</h2>
                <p className="mt-0.5 text-xs text-[#596257]">Newest activity appears first</p>
              </div>

              <div className="divide-y divide-[#edf2eb]">
                {payments.map((payment) => {
                  const MethodIcon = payment.method === 'cod' ? MdLocalAtm : MdCreditCard
                  const transactionDate = payment.paidAt || payment.createdAt
                  return (
                    <article key={payment.id} className="grid gap-4 px-5 py-5 transition hover:bg-[#fafcf9] sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
                      <div className="flex min-w-0 items-start gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7ea] text-[#4d8d41]">
                          <MethodIcon className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link href={`/track/${encodeURIComponent(payment.trackingId)}`} className="truncate font-mono text-sm font-black text-[#31542b] hover:underline">
                              {payment.trackingId}
                            </Link>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ring-1 ${STATUS_STYLES[payment.status] || STATUS_STYLES.pending}`}>
                              {payment.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {payment.method === 'cod' ? 'Cash on delivery' : 'Online payment'} · {formatDate(transactionDate)}
                          </p>
                        </div>
                      </div>
                      <div className="pl-[3.75rem] sm:pl-0 sm:text-right">
                        <p className="text-lg font-black">{formatMoney(payment.paidAmount ?? payment.amount)}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          {payment.status === 'paid' ? 'Amount paid' : 'Order amount'}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}