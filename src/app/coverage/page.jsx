'use client'

import { useMemo, useState } from "react"
import { MdOutlineSearch } from "react-icons/md"
import BangladeshMapLoader from "@/app/components/coverageArea/BangladeshMapLoader"
import warehouses from "@/app/data/warehouse.data.json"

const MAX_VISIBLE_RESULTS = 8

const Coverage = () => {
  const [query, setQuery] = useState("")
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)
  const [notFound, setNotFound] = useState(false)

  // Every field is matched, so typing a region ("Barishal") or a covered area
  // ("Mirpur") finds branches that do not have that text in the district name.
  const matches = useMemo(() => {
    const searchText = query.trim().toLowerCase()

    if (!searchText) return warehouses

    return warehouses.filter((warehouse) => {
      const coveredArea = (warehouse.covered_area || []).join(' ').toLowerCase()

      return (
        warehouse.district.toLowerCase().includes(searchText) ||
        warehouse.city.toLowerCase().includes(searchText) ||
        warehouse.region.toLowerCase().includes(searchText) ||
        coveredArea.includes(searchText)
      )
    })
  }, [query])

  const filteredWarehouses = useMemo(
    () => matches.slice(0, MAX_VISIBLE_RESULTS),
    [matches]
  )

  const handleSelectWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse)
    setQuery(warehouse.district)
    setNotFound(false)
  }

  /**
   * Selecting from the chips already moves the map, so submitting the form is
   * for typed input. This used to require an exact district match, which meant
   * pressing Enter on a partial query silently did nothing. Now it falls back
   * to the first branch the live filter matched, so Enter always resolves to
   * something when there is a match.
   */
  const handleSearch = (event) => {
    event.preventDefault()

    const searchText = query.trim().toLowerCase()

    if (!searchText) return

    const exactMatch = warehouses.find(
      (warehouse) => warehouse.district.toLowerCase() === searchText
    )

    if (exactMatch) {
      handleSelectWarehouse(exactMatch)
      return
    }

    if (matches.length > 0) {
      handleSelectWarehouse(matches[0])
      return
    }

    setNotFound(true)
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
              onChange={(event) => {
                setQuery(event.target.value)
                setNotFound(false)
              }}
              placeholder="Search district, city, or area"
              aria-label="Search delivery coverage"
              className="h-12 w-full rounded-md border border-brand-accent-sage bg-white pl-12 pr-4 text-brand-content shadow-sm outline-none transition placeholder:text-brand-content-subtle focus:border-brand-accent-bright focus:ring-2 focus:ring-brand-accent-bright/20"
            />
          </label>

          <div className="flex flex-wrap justify-center gap-2">
            {filteredWarehouses.length === 0 && !query.trim() && (
              <p className="text-sm text-brand-content-muted">No branches to show.</p>
            )}
            {filteredWarehouses.map((warehouse) => (
              <button
                type="button"
                key={warehouse.district}
                onClick={() => handleSelectWarehouse(warehouse)}
                aria-pressed={selectedWarehouse?.district === warehouse.district}
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

          {/* The chip row is capped at 8, so without this a search like "a" looks
              like the whole network is 8 branches. */}
          <p className="text-center text-sm text-brand-content-muted" aria-live="polite">
            {query.trim()
              ? `Showing ${filteredWarehouses.length} of ${matches.length} matching ${matches.length === 1 ? 'branch' : 'branches'}`
              : `Showing ${filteredWarehouses.length} of ${warehouses.length} branches`}
          </p>

          {notFound && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700"
            >
              No SwiftShip branch matches “{query.trim()}”. Try a district name such as Dhaka or Chattogram.
            </p>
          )}
        </form>

        <BangladeshMapLoader selectedWarehouse={selectedWarehouse} />
      </section>
    </main>
  )
}

export default Coverage
