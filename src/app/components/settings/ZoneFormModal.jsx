'use client'

import { useMemo, useState } from 'react'
import { MdClose, MdMap, MdSearch } from 'react-icons/md'

/**
 * Create/edit modal for a service zone. `mode` controls the header copy and
 * submit label; the same form handles both flows.
 *
 * @param {{
 *   mode: 'create' | 'edit',
 *   initialData?: { name?: string, districts?: string[], isActive?: boolean },
 *   districtOptions: string[],
 *   onClose: () => void,
 *   onSubmit: (payload: { name: string, districts: string[], isActive: boolean }) => void,
 *   isPending?: boolean,
 * }} props
 */
export default function ZoneFormModal({
  mode = 'create',
  initialData,
  districtOptions,
  onClose,
  onSubmit,
  isPending = false,
}) {
  const [name, setName] = useState(initialData?.name || '')
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [selectedDistricts, setSelectedDistricts] = useState(initialData?.districts || [])
  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return districtOptions
    return districtOptions.filter((district) => district.toLowerCase().includes(term))
  }, [districtOptions, search])

  const toggleDistrict = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district) ? prev.filter((item) => item !== district) : [...prev, district]
    )
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    onSubmit({ name: name.trim(), districts: selectedDistricts, isActive })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-[#e8f0e5] max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#edf7ea] flex items-center justify-center shrink-0">
              <MdMap className="size-5 text-[#4d8d41]" />
            </div>
            <h3 className="text-xl font-bold text-[#1f2a1d]">
              {mode === 'edit' ? 'Edit Zone' : 'Add Service Zone'}
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle -mt-1 -mr-1" aria-label="Close">
            <MdClose className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-5 pr-1">
          <div>
            <label className="block text-sm font-medium text-[#1f2a1d] mb-1">Zone Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Greater Dhaka"
              className="input input-bordered w-full focus:border-[#83BD75] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[#f7fbf5] border border-[#e8f0e5] rounded-lg">
            <div>
              <p className="text-sm font-bold text-[#1f2a1d]">Active</p>
              <p className="text-xs text-[#596257]">Inactive zones are hidden from operational views.</p>
            </div>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="toggle toggle-success"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
              Districts <span className="text-[#596257] font-normal">({selectedDistricts.length} selected)</span>
            </label>

            {selectedDistricts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {selectedDistricts.map((district) => (
                  <button
                    key={district}
                    type="button"
                    onClick={() => toggleDistrict(district)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#edf7ea] text-xs font-semibold text-[#4d8d41] hover:bg-[#dcefd6]"
                  >
                    {district}
                    <MdClose className="size-3" />
                  </button>
                ))}
              </div>
            )}

            <div className="relative mb-2">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search districts…"
                className="input input-bordered input-sm w-full pl-9 focus:border-[#83BD75] focus:outline-none"
              />
            </div>

            <div className="border border-[#dce8d8] rounded-lg max-h-40 overflow-y-auto p-2 flex flex-wrap gap-1.5 content-start">
              {filteredOptions.length === 0 && (
                <p className="text-xs text-slate-400 px-1 py-2">No districts match “{search}”.</p>
              )}
              {filteredOptions.map((district) => {
                const isSelected = selectedDistricts.includes(district)
                return (
                  <button
                    key={district}
                    type="button"
                    onClick={() => toggleDistrict(district)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-[#4d8d41] text-white border-[#4d8d41]'
                        : 'bg-white text-[#596257] border-[#dce8d8] hover:border-[#83BD75]'
                    }`}
                  >
                    {district}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#e8f0e5] shrink-0">
          <button onClick={onClose} className="btn btn-ghost" disabled={isPending}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="btn bg-[#83BD75] text-[#172015] hover:bg-[#74ad68] disabled:opacity-50 shadow-sm"
          >
            {isPending ? (
              <span className="loading loading-spinner loading-sm" />
            ) : mode === 'edit' ? (
              'Save Changes'
            ) : (
              'Create Zone'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}