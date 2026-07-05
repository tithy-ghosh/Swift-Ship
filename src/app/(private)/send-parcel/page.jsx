'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import SendParcel from '@/app/components/parcelSending/sendParcel'
import warehouses from '@/app/data/warehouse.data.json'
import useAuth from '@/app/hooks/useAuth'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const readApiResponse = async (res) => {
  const contentType = res.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return res.json()
  }

  const text = await res.text()
  const isHtml = text.trimStart().startsWith('<!DOCTYPE') || text.trimStart().startsWith('<html')

  return {
    error: isHtml
      ? 'Backend API returned an HTML page instead of JSON. Check the API URL and backend route.'
      : text || 'Backend API did not return JSON.',
  }
}

const getUniqueValues = (items, key) => {
  return [...new Set(items.map((item) => item[key]))].sort()
}

const getServiceCenters = (region) => {
  if (!region) return []
  return warehouses
    .filter((warehouse) => warehouse.region === region)
    .map((warehouse) => warehouse.district)
    .sort()
}

export default function SendParcelPage() {
  const { user } = useAuth()
  const [costInfo, setCostInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    if (currentUserName) setValue('senderName', currentUserName)
  }, [currentUserName, setValue])

  useEffect(() => {
    setValue('senderServiceCenter', '')
  }, [senderRegion, setValue])

  useEffect(() => {
    setValue('receiverServiceCenter', '')
  }, [receiverRegion, setValue])

  // Get Firebase token for backend requests
  const getToken = async () => {
    if (!user) throw new Error('Not logged in')
    return await user.getIdToken()
  }

  // Step 1 — Get price quote from Express backend
  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    try {
      if (!API_URL) {
        setError('Backend API URL is missing.')
        return
      }

      const token = await getToken()

      const res = await fetch(`${API_URL}/api/parcels/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: data.type,
          weight: data.weight,
          senderServiceCenter: data.senderServiceCenter,
          receiverServiceCenter: data.receiverServiceCenter,
        }),
      })

      const result = await readApiResponse(res)

      if (!res.ok) {
        setError(result.error || 'Failed to calculate price.')
        return
      }

      const { trackingId, deliveryCost, deliveryZone, costBreakdown } = result

      setCostInfo({
        costBreakdown,
        deliveryCost,
        parcelData: {
          ...data,
          deliveryCost,
          deliveryZone,
          trackingId,
        },
      })
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — Save confirmed parcel to MongoDB via Express backend
  const handleConfirm = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!API_URL) {
        setError('Backend API URL is missing.')
        return
      }

      const token = await getToken()

      const res = await fetch(`${API_URL}/api/parcels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(costInfo.parcelData),
      })

      const result = await readApiResponse(res)

      if (!res.ok) {
        setError(result.error || 'Failed to save parcel.')
        return
      }

      console.log('Parcel saved:', result.trackingId)
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
    } catch (err) {
      setError('Failed to save parcel. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SendParcel
      costInfo={costInfo}
      errors={errors}
      error={error}
      loading={loading}
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
