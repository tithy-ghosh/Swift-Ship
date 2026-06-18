
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
        const coveredAreas = warehouse.covered_area?.join(', ') || 'Coverage area coming soon'

        const marker = L.marker(markerPosition, { icon: customIcon })
          .addTo(map)
          .bindPopup(`
            <strong>${warehouse.district}</strong><br />
            Region: ${warehouse.region}<br />
            Branch: ${warehouse.city}<br />
            Covered: ${coveredAreas}
          `)

        markersRef.current[warehouse.district.toLowerCase()] = marker

        return markerPosition
      })

    if (markerPositions.length > 0) {
      map.fitBounds(markerPositions, {
        padding: [28, 28],
      })
    }

    mapRef.current = map

    const resize = () => {
      window.requestAnimationFrame(() => {
        map.invalidateSize()
      })
    }

    resize()

    const timers = [100, 300, 600].map((delay) => {
      return window.setTimeout(resize, delay)
    })

    const observer = new ResizeObserver(resize)
    observer.observe(containerRef.current)

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
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
    <div className="mt-8 h-[420px] w-full overflow-hidden rounded-lg border border-[#dbe7d8] bg-white shadow-lg">
      <div ref={containerRef} className="z-0 h-full w-full" />
    </div>
  )
}

export default BangladeshMap
