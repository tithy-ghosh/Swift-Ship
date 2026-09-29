
'use client'

import L from 'leaflet'
import { useEffect, useRef } from 'react'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import warehouses from '@/app/data/warehouse.data.json'

const position = [23.685, 90.3563]

const getIconUrl = (icon) => {
  return typeof icon === 'string' ? icon : icon.src
}

const escapeHtml = (value) => {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[character]
  })
}

const BangladeshMap = ({ selectedWarehouse }) => {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const markersRef = useRef({})

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const customIcon = new L.Icon({
      iconRetinaUrl: getIconUrl(markerIcon2x),
      iconUrl: getIconUrl(markerIcon),
      shadowUrl: getIconUrl(markerShadow),
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    const map = L.map(containerRef.current, {
      center: position,
      zoom: 7,
      scrollWheelZoom: false,
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const markerPositions = warehouses
      .filter((warehouse) => warehouse.latitude && warehouse.longitude)
      .map((warehouse) => {
        const markerPosition = [warehouse.latitude, warehouse.longitude]
        // Popups take an HTML string, so any field containing `<`, `&` or a
        // quote would otherwise be injected as markup. District and city names
        // are safe today, but this data is hand-maintained and edited often.
        const coveredAreas =
          (warehouse.covered_area || []).join(', ') || 'Coverage area coming soon'

        const marker = L.marker(markerPosition, { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <strong>${escapeHtml(warehouse.district)}</strong><br />
            Region: ${escapeHtml(warehouse.region)}<br />
            Branch: ${escapeHtml(warehouse.city)}<br />
            Covered: ${escapeHtml(coveredAreas)}
          `)

        markersRef.current[warehouse.district.toLowerCase()] = marker

        return markerPosition
      })

    if (markerPositions.length > 0) {
      map.fitBounds(markerPositions, {
        padding: [28, 28],
      })
    }

    let isActive = true

    // Wheel zoom stays off until the visitor interacts with the map, so
    // scrolling the page over it does not get swallowed. This is the standard
    // pattern for maps embedded in long pages.
    const container = containerRef.current
    const enableWheelZoom = () => {
      if (isActive && !map.scrollWheelZoom.enabled()) {
        map.scrollWheelZoom.enable()
      }
    }

    container.addEventListener('click', enableWheelZoom)
    container.addEventListener('focusin', enableWheelZoom)

    mapRef.current = map
    const animationFrames = new Set()
    const resize = () => {
      if (!isActive || !containerRef.current) {
        return
      }

      const frameId = window.requestAnimationFrame(() => {
        animationFrames.delete(frameId)

        if (!isActive || !containerRef.current || mapRef.current !== map) {
          return
        }

        map.invalidateSize({ pan: false })
      })

      animationFrames.add(frameId)
    }

    resize()

    const timers = [100, 300, 600].map((delay) => {
      return window.setTimeout(resize, delay)
    })

    const observer = new ResizeObserver(resize)
    observer.observe(containerRef.current)

    return () => {
      isActive = false
      container.removeEventListener('click', enableWheelZoom)
      container.removeEventListener('focusin', enableWheelZoom)
      timers.forEach((timer) => window.clearTimeout(timer))
      animationFrames.forEach((frameId) => window.cancelAnimationFrame(frameId))
      observer.disconnect()
      map.remove()
      mapRef.current = null
      markersRef.current = {}
    }
  }, [])

  useEffect(() => {
    if (!selectedWarehouse || !mapRef.current) {
      return
    }

    const marker = markersRef.current[selectedWarehouse.district.toLowerCase()]
    const markerPosition = [selectedWarehouse.latitude, selectedWarehouse.longitude]

    mapRef.current.setView(markerPosition, 10, {
      animate: true,
    })

    marker?.openPopup()
  }, [selectedWarehouse])

  return (
    <div className="mt-8 h-[420px] w-full overflow-hidden rounded-lg border border-brand-border-subtle bg-white shadow-lg">
      <div
        ref={containerRef}
        className="z-0 h-full w-full"
        role="region"
        aria-label="Map of SwiftShip delivery branches"
      />
    </div>
  )
}

export default BangladeshMap
