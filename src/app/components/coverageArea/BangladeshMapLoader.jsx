'use client'

import dynamic from "next/dynamic"

const BangladeshMap = dynamic(() => import("./BangladeshMap"), {
  ssr: false,
  loading: () => (
    <div
      role="status"
      className="mt-8 flex h-[420px] w-full items-center justify-center rounded-lg border border-brand-border-subtle bg-brand-surface-sunken text-sm font-semibold text-brand-content-strong"
    >
      Loading map...
    </div>
  ),
})

export default function BangladeshMapLoader({ selectedWarehouse }) {
  return <BangladeshMap selectedWarehouse={selectedWarehouse} />
}
