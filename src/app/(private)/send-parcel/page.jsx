'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import SendParcel from '@/app/components/parcelSending/sendParcel'
import warehouses from '@/app/data/warehouse.data.json'
import useAuth from '@/app/hooks/useAuth'
import { type } from 'firebase/firestore/pipelines'
import { db } from '@/app/firebase/firebase.init'

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



export default function SendParcelPage() {
  const { user } = useAuth()
  const [costInfo, setCostInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ error, setError ] = useState(null)

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

  //  Calls the API route to calculate price and generate tracking ID server-side
   const onSubmit = async (data) => {
    setLoading(true);
    setError(null)

    try {
      const res = await fetch('/api/parcels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: data.type,
          weight: data.weight,
          senderServiceCenter: data.senderServiceCenter,
          receiverServiceCenter: data.receiverServiceCenter
        }),

      })
      const result = await res.json()
      if(!res.ok){
        setError(result.error || 'Failed to calculate price.')
        return
      }
      const { trackingId, deliveryZone, costBreakdown } = result

      setCostInfo({
        costBreakdown,
        deliveryCost,
        parcelData: {
          ...data,
          deliveryCost, 
          deliveryZone,
          trackingId
        }
      })
    } catch (error) {
      setError('Something went wrong. Please try again.')
      console.error(error)
    } finally{
      setLoading(false)
    }
   }
  }

  // Saves the confirmed parcel to firestore
  const handleConfirm = async () => {
    setLoading(true)
    setError(null)

    try {
      const parcelInfo = {
        ...constInfo.parcelData,
        costBreakdown: constInfo.costBreakdown,
        createdBy: {
          email: currentUserEmail,
          name: currentUserName,
          uid: user?.uid || '' ,

        },
        createdByEmail: currentUserEmail,
        creation_date: new Date().toISOString(),
        status : 'pending',
      }
      const docRef = await addDoc(collection(db, 'parcels'), parcelInfo)
      console.log('Parcel saved with ID: ', docRef.id)
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
    } catch (error) {
    setError('Failed to save parcel. Please try again.')
      console.error(error)
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
