'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import SendParcel from '@/app/components/parcelSending/sendParcel'
import warehouses from '@/app/data/warehouse.data.json'
import useAuth from '@/app/hooks/useAuth'

const getUniqueValues = (items, key) => {
  return [...new Set(items.map((item) => item[key]))].sort()
}

const getServiceCenters = (region) => {
  if (!region) {
    return []
  }

  return warehouses
    .filter((warehouse) => warehouse.region === region)
    .map((warehouse) => warehouse.district)
    .sort()
}

const calculateDeliveryCharge = ({
  type,
  weight,
  senderServiceCenter,
  receiverServiceCenter,
}) => {
  const parcelWeight = Number(weight) || 1
  const isWithinCity = senderServiceCenter === receiverServiceCenter
  const deliveryZone = isWithinCity ? 'Within City' : 'Outside City/District'

  if (type === 'document') {
    const deliveryCost = isWithinCity ? 50 : 80

    return {
      deliveryCost,
      deliveryZone,
      costBreakdown: [
        {
          label: `Document delivery (${deliveryZone})`,
          amount: deliveryCost,
        },
      ],
    }
  }

  const baseCost = isWithinCity ? 80 : 130

  if (parcelWeight <= 3) {
    return {
      deliveryCost: baseCost,
      deliveryZone,
      costBreakdown: [
        {
          label: `Non-document base charge up to 3 kg (${deliveryZone})`,
          amount: baseCost,
        },
      ],
    }
  }

  const extraWeight = Math.ceil(parcelWeight - 3)
  const extraWeightCost = extraWeight * 20
  const outsideCityCharge = isWithinCity ? 0 : 20
  const deliveryCost = baseCost + extraWeightCost + outsideCityCharge
  const costBreakdown = [
    {
      label: `Non-document base charge up to 3 kg (${deliveryZone})`,
      amount: baseCost,
    },
    {
      label: `Extra weight charge (${extraWeight} kg x BDT 20)`,
      amount: extraWeightCost,
    },
  ]

  if (outsideCityCharge) {
    costBreakdown.push({
      label: 'Outside city/district charge',
      amount: outsideCityCharge,
    })
  }

  return {
    deliveryCost,
    deliveryZone,
    costBreakdown,
  }
}

export default function SendParcelPage() {
  const { user } = useAuth()
  const [costInfo, setCostInfo] = useState(null)
  const currentUserEmail = user?.email || ''
  const currentUserName = user?.displayName || user?.email?.split('@')[0] || ''

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: 'document',
      senderName: '',
    },
  })

  const parcelType = useWatch({ control, name: 'type' })
  const senderRegion = useWatch({ control, name: 'senderRegion' })
  const receiverRegion = useWatch({ control, name: 'receiverRegion' })

  const regions = useMemo(() => getUniqueValues(warehouses, 'region'), [])
  const senderServiceCenters = useMemo(() => getServiceCenters(senderRegion), [senderRegion])
  const receiverServiceCenters = useMemo(() => getServiceCenters(receiverRegion), [receiverRegion])

  useEffect(() => {
    if (currentUserName) {
      setValue('senderName', currentUserName)
    }
  }, [currentUserName, setValue])

  useEffect(() => {
    setValue('senderServiceCenter', '')
  }, [senderRegion, setValue])

  useEffect(() => {
    setValue('receiverServiceCenter', '')
  }, [receiverRegion, setValue])

  const onSubmit = (data) => {
    const { costBreakdown, deliveryCost, deliveryZone } = calculateDeliveryCharge(data)

    setCostInfo({
      costBreakdown,
      deliveryCost,
      parcelData: {
        ...data,
        deliveryCost,
        deliveryZone,
      },
    })
  }

  const handleConfirm = () => {
    const createdAt = new Date().toISOString()
    const parcelInfo = {
      ...costInfo.parcelData,
      costBreakdown: costInfo.costBreakdown,
      createdBy: {
        email: currentUserEmail,
        name: currentUserName,
        uid: user?.uid || '',
      },
      createdByEmail: currentUserEmail,
      creation_date: createdAt,
      status: 'pending',
    }

    console.log('Ready to save parcel:', parcelInfo)
    setCostInfo(null)
    reset({
      type: 'document',
      title: '',
      weight: '',
      senderName: currentUserName,
      senderContact: '',
      senderRegion: '',
      senderServiceCenter: '',
      senderAddress: '',
      pickupInstruction: '',
      receiverName: '',
      receiverContact: '',
      receiverRegion: '',
      receiverServiceCenter: '',
      receiverAddress: '',
      deliveryInstruction: '',
    })
  }

  return (
    <SendParcel
      costInfo={costInfo}
      errors={errors}
      handleConfirm={handleConfirm}
      handleSubmit={handleSubmit}
      onCancelConfirm={() => setCostInfo(null)}
      onSubmit={onSubmit}
      parcelType={parcelType}
      receiverRegion={receiverRegion}
      receiverServiceCenters={receiverServiceCenters}
      regions={regions}
      register={register}
      senderRegion={senderRegion}
      senderServiceCenters={senderServiceCenters}
    />
  )
}
