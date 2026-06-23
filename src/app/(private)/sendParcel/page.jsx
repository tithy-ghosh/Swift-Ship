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

const calculateDeliveryCost = ({
  type,
  weight,
  senderRegion,
  receiverRegion,
  senderServiceCenter,
  receiverServiceCenter,
}) => {
  const parcelWeight = Number(weight) || 1
  const isSameRegion = senderRegion === receiverRegion
  const isSameServiceCenter = senderServiceCenter === receiverServiceCenter

  if (type === 'document') {
    if (isSameServiceCenter) return 60
    return isSameRegion ? 80 : 120
  }

  const baseCost = isSameServiceCenter ? 90 : isSameRegion ? 120 : 170
  const extraWeightCost = Math.max(parcelWeight - 1, 0) * 30

  return baseCost + extraWeightCost
}

export default function SendParcelPage() {
  const { user } = useAuth()
  const [costInfo, setCostInfo] = useState(null)

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
    const senderName = user?.displayName || user?.email?.split('@')[0] || ''

    if (senderName) {
      setValue('senderName', senderName)
    }
  }, [setValue, user])

  useEffect(() => {
    setValue('senderServiceCenter', '')
  }, [senderRegion, setValue])

  useEffect(() => {
    setValue('receiverServiceCenter', '')
  }, [receiverRegion, setValue])

  const onSubmit = (data) => {
    const deliveryCost = calculateDeliveryCost(data)

    setCostInfo({
      deliveryCost,
      parcelData: {
        ...data,
        deliveryCost,
      },
    })
  }

  const handleConfirm = () => {
    const parcelInfo = {
      ...costInfo.parcelData,
      creation_date: new Date().toISOString(),
    }

    console.log('Ready to save parcel:', parcelInfo)
    setCostInfo(null)
    reset({
      type: 'document',
      title: '',
      weight: '',
      senderName: user?.displayName || user?.email?.split('@')[0] || '',
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
