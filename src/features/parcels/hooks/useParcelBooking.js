'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query' 
import useAuth from '@/app/hooks/useAuth'
import warehouses from '@/app/data/warehouse.data.json'
import {
  createParcel,
  getParcelQuote,
  getRequestErrorMessage,
  initializeParcelPayment,
} from '../api/parcelApi'
import { createParcelFormDefaults, DEFAULT_PAYMENT_METHOD } from '../config/parcelForm'
import { getRegions, getServiceCenters } from '../utils/warehouse'

export const useParcelBooking = () => {
  const { user } = useAuth()
  const [costInfo, setCostInfo] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD)

  const createdParcelRef = useRef(null)
  const senderName = user?.displayName || user?.email?.split('@')[0] || ''
  const form = useForm({ defaultValues: createParcelFormDefaults() })
  const { control, reset, setValue } = form

  const parcelType = useWatch({ control, name: 'type' })
  const senderRegion = useWatch({ control, name: 'senderRegion' })
  const receiverRegion = useWatch({ control, name: 'receiverRegion' })
  const regions = useMemo(() => getRegions(warehouses), [])
  const senderServiceCenters = useMemo(
    () => getServiceCenters(warehouses, senderRegion),
    [senderRegion]
  )
  const receiverServiceCenters = useMemo(
    () => getServiceCenters(warehouses, receiverRegion),
    [receiverRegion]
  )

  useEffect(() => {
    if (senderName) setValue('senderName', senderName)
  }, [senderName, setValue])

  useEffect(() => {
    setValue('senderServiceCenter', '')
  }, [senderRegion, setValue])

  useEffect(() => {
    setValue('receiverServiceCenter', '')
  }, [receiverRegion, setValue])

  const clearConfirmation = () => {
    setCostInfo(null)
    setPaymentMethod(DEFAULT_PAYMENT_METHOD)
    createdParcelRef.current = null
  }

  const resetBooking = () => {
    clearConfirmation()
    reset(createParcelFormDefaults(senderName))
  }

  //  1. QUOTE MUTATION
  const quoteMutation = useMutation({
    mutationFn: (formData) =>
      getParcelQuote({
        type: formData.type,
        weight: formData.weight,
        senderServiceCenter: formData.senderServiceCenter,
        receiverServiceCenter: formData.receiverServiceCenter,
      }),
    onSuccess: (quote, formData) => {
      createdParcelRef.current = null
      setCostInfo({
        costBreakdown: quote.costBreakdown,
        deliveryCost: quote.deliveryCost,
        parcelData: {
          ...formData,
          deliveryCost: quote.deliveryCost,
          deliveryZone: quote.deliveryZone,
          trackingId: quote.trackingId,
        },
      })
    },
  })

  // 2. CREATE PARCEL MUTATION
  const createParcelMutation = useMutation({
    mutationFn: (data) => createParcel(data),
  })

  // 3. INITIALIZE PAYMENT MUTATION
  const paymentMutation = useMutation({
    mutationFn: (parcelId) => initializeParcelPayment(parcelId),
  })

  // Clean wrapper functions for the UI to call
  const submitForQuote = (formData) => {
    quoteMutation.mutate(formData)
  }

  const confirmBooking = async () => {
    if (!costInfo) return

    try {
      let parcel = createdParcelRef.current

      // Step 1: Create the parcel if it doesn't exist yet
      if (!parcel) {
        const result = await createParcelMutation.mutateAsync({ 
          ...costInfo.parcelData, 
          paymentMethod 
        })
        parcel = { id: result._id || result.id, trackingId: result.trackingId }
        createdParcelRef.current = parcel
      }

      // Step 2: If online payment, redirect to gateway
      if (paymentMethod === 'online') {
        if (!parcel.id) throw new Error('The server did not return a parcel ID for payment.')

        const payment = await paymentMutation.mutateAsync(parcel.id)
        if (!payment.gatewayUrl) throw new Error('The payment gateway URL was not returned.')

        window.location.assign(payment.gatewayUrl)
        return
      }

      // Step 3: Success (COD)
      resetBooking()
    } catch (error) {
      console.error('Unable to confirm parcel:', error)
      // Errors are automatically caught and stored in the mutation objects below
    }
  }

  return {
    form,
    costInfo,
    
    // ✅ Map React Query's automatic states to the names your UI expects
    quoteError: quoteMutation.error 
      ? getRequestErrorMessage(quoteMutation.error, 'Failed to calculate the delivery price.') 
      : null,
      
    confirmError: (createParcelMutation.error || paymentMutation.error) 
      ? getRequestErrorMessage(createParcelMutation.error || paymentMutation.error, 'Failed to save the parcel. Please try again.') 
      : null,
      
    isQuoting: quoteMutation.isPending,
    isConfirming: createParcelMutation.isPending || paymentMutation.isPending,
    
    paymentMethod,
    setPaymentMethod,
    parcelType,
    senderRegion,
    receiverRegion,
    regions,
    senderServiceCenters,
    receiverServiceCenters,
    submitForQuote,
    confirmBooking,
    clearConfirmation,
  }
}