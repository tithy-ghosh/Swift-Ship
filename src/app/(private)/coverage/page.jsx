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
    <main className="min-h-screen bg-brand-surface-muted px-5 pb-12 pt-32 text-brand-content">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">
            Delivery Coverage
          </p>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-brand-content-strong sm:text-4xl">
            Find SwiftShip Coverage in Your District
          </h1>
        </div>

        <form onSubmit={handleSearch} className="mt-6 w-full max-w-2xl space-y-3">
          <label className="relative block">
            <MdOutlineSearch className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-brand-content-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search district name"
              className="h-12 w-full rounded-md border border-brand-accent-sage bg-white pl-12 pr-4 text-brand-content shadow-sm outline-none transition placeholder:text-brand-content-subtle focus:border-brand-accent-bright focus:ring-2 focus:ring-brand-accent-bright/20"
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
                    ? "border-brand-accent-bright bg-brand-accent-bright text-brand-surface-inverse-deep"
                    : "border-brand-border-subtle bg-white text-brand-content-strong hover:border-brand-accent-bright"
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
