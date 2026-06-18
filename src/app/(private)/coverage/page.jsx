'use client'

import { useMemo, useState } from "react"
import { MdOutlineSearch } from "react-icons/md"
import BangladeshMapLoader from "@/app/components/coverageArea/BangladeshMapLoader"
import warehouses from "@/app/data/warehouse.data.json"

const Coverage = () => {
  const [query, setQuery] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)

  const filteredWarehouses = useMemo(() => {
    const searchText = query.trim().toLowerCase()

    if (!searchText) {
      return warehouses.slice(0, 8)
    }

    return warehouses
      .filter((warehouse) => {
        return (
          warehouse.district.toLowerCase().includes(searchText) ||
          warehouse.city.toLowerCase().includes(searchText) ||
          warehouse.region.toLowerCase().includes(searchText)
        )
      })
      .slice(0, 8)
  }, [query])

  const handleSelectWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setQuery(warehouse.district)
  }

  const handleSearch = (event) => {
    event.preventDefault()

    const searchText = query.trim().toLowerCase()
    const matchedWarehouse = warehouses.find((warehouse) => {
      return warehouse.district.toLowerCase() === searchText
    })

    if (matchedWarehouse) {
      handleSelectWarehouse(matchedWarehouse)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7fbf5] px-5 pb-12 pt-32 text-[#1f2a1d]">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4d8d41]">
            Delivery Coverage
          </p>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-[#31542b] sm:text-4xl">
            Find SwiftShip Coverage in Your District
          </h1>
        </div>

        <form onSubmit={handleSearch} className="mt-6 w-full max-w-2xl space-y-3">
          <label className="relative block">
            <MdOutlineSearch className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6b7567]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search district name"
              className="h-12 w-full rounded-md border border-[#cbdac7] bg-white pl-12 pr-4 text-[#1f2a1d] shadow-sm outline-none transition placeholder:text-[#8a9487] focus:border-[#83BD75] focus:ring-2 focus:ring-[#83BD75]/20"
            />
          </label>

          <div className="flex flex-wrap justify-center gap-2">
            {filteredWarehouses.map((warehouse) => (
              <button
                type="button"
                key={warehouse.district}
                onClick={() => handleSelectWarehouse(warehouse)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                  selectedWarehouse?.district === warehouse.district
                    ? "border-[#83BD75] bg-[#83BD75] text-[#172015]"
                    : "border-[#dbe7d8] bg-white text-[#31542b] hover:border-[#83BD75]"
                }`}
              >
                {warehouse.district}
              </button>
            ))}
          </div>
        </form>

        <BangladeshMapLoader selectedWarehouse={selectedWarehouse} />
      </section>
    </main>
  )
}

export default Coverage
