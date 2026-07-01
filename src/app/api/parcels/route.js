import { NextResponse } from 'next/server'

const generateTrackingId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `SS-${date}-${randomPart}`
}

const calculateDeliveryCharge = ({ type, weight, senderServiceCenter, receiverServiceCenter }) => {
  const parcelWeight = Number(weight) || 1
  const isWithinCity = senderServiceCenter === receiverServiceCenter
  const deliveryZone = isWithinCity ? 'Within City' : 'Outside City/District'

  if (type === 'document') {
    const deliveryCost = isWithinCity ? 50 : 80
    return {
      deliveryCost,
      deliveryZone,
      costBreakdown: [
        { label: `Document delivery (${deliveryZone})`, amount: deliveryCost },
      ],
    }
  }

  const baseCost = isWithinCity ? 80 : 130

  if (parcelWeight <= 3) {
    return {
      deliveryCost: baseCost,
      deliveryZone,
      costBreakdown: [
        { label: `Non-document base charge up to 3 kg (${deliveryZone})`, amount: baseCost },
      ],
    }
  }

  const extraWeight = Math.ceil(parcelWeight - 3)
  const extraWeightCost = extraWeight * 20
  const outsideCityCharge = isWithinCity ? 0 : 20
  const deliveryCost = baseCost + extraWeightCost + outsideCityCharge

  const costBreakdown = [
    { label: `Non-document base charge up to 3 kg (${deliveryZone})`, amount: baseCost },
    { label: `Extra weight charge (${extraWeight} kg x BDT 20)`, amount: extraWeightCost },
  ]

  if (outsideCityCharge) {
    costBreakdown.push({ label: 'Outside city/district charge', amount: outsideCityCharge })
  }

  return { deliveryCost, deliveryZone, costBreakdown }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { type, weight, senderServiceCenter, receiverServiceCenter } = body

    if (!type || !senderServiceCenter || !receiverServiceCenter) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { deliveryCost, deliveryZone, costBreakdown } = calculateDeliveryCharge({
      type,
      weight,
      senderServiceCenter,
      receiverServiceCenter,
    })

    const trackingId = generateTrackingId()

    return NextResponse.json({ trackingId, deliveryCost, deliveryZone, costBreakdown })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}