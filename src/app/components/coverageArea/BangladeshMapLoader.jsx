'use client'

import dynamic from "next/dynamic"

const BangladeshMap = dynamic(() => import("./BangladeshMap"), {
  ssr: false,
  loading: () => (
    <div className="mt-8 flex h-[420px] w-full items-center justify-center rounded-lg border border-[#dbe7d8] bg-[#eef7eb] text-sm font-semibold text-[#31542b]">
      Loading map...
    </div>
  ),
})

export default function BangladeshMapLoader({ selectedWarehouse }) {
  return <BangladeshMap selectedWarehouse={selectedWarehouse} />
}
