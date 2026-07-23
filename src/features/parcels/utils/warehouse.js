/** @param {Array<{region: string}>} warehouses */
export const getRegions = (warehouses) => {
  return [...new Set(warehouses.map(({ region }) => region))].sort()
}

/**
 * Returns sorted service-center districts belonging to a region.
 * @param {Array<{region: string, district: string}>} warehouses
 * @param {string} region
 */
export const getServiceCenters = (warehouses, region) => {
  if (!region) return []
  return warehouses
    .filter((warehouse) => warehouse.region === region)
    .map(({ district }) => district)
    .sort()
}
