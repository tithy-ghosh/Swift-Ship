'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
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

/**
 * Owns the quote, confirmation, and payment workflow for a parcel booking.
 *
 * Keeping this state machine outside the page leaves the route as a thin
 * composition layer and provides one place for future booking-rule changes.
 */
export const useParcelBooking = () => {
  const { user } = useAuth()
  const [costInfo, setCostInfo] = useState(null)
  const [quoteError, setQuoteError] = useState(null)
  const [confirmError, setConfirmError] = useState(null)
  const [isQuoting, setIsQuoting] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD)

  // Retaining the created parcel avoids duplicates when payment initialization is retried.
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

  const getToken = async () => {
    if (!user) throw new Error('You must be logged in to book a parcel.')
    return user.getIdToken()
  }

  const clearConfirmation = () => {
    setCostInfo(null)
    setConfirmError(null)
    setPaymentMethod(DEFAULT_PAYMENT_METHOD)
    createdParcelRef.current = null
  }

  const resetBooking = () => {
    clearConfirmation()
    reset(createParcelFormDefaults(senderName))
  }

  /** Fetches the price displayed in the confirmation modal. */
  const submitForQuote = async (formData) => {
    setIsQuoting(true)
    setQuoteError(null)

    try {
      const token = await getToken()
      const quote = await getParcelQuote(
        {
          type: formData.type,
          weight: formData.weight,
          senderServiceCenter: formData.senderServiceCenter,
          receiverServiceCenter: formData.receiverServiceCenter,
        },
        token
      )

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
    } catch (error) {
      console.error('Unable to quote parcel:', error)
      setQuoteError(getRequestErrorMessage(error, 'Failed to calculate the delivery price.'))
    } finally {
      setIsQuoting(false)
    }
  }

  /** Creates the parcel once, then completes COD or redirects to online payment. */
  const confirmBooking = async () => {
    if (!costInfo) return

    setIsConfirming(true)
    setConfirmError(null)

    try {
      const token = await getToken()
      let parcel = createdParcelRef.current

      if (!parcel) {
        const result = await createParcel({ ...costInfo.parcelData, paymentMethod }, token)
        parcel = { id: result._id || result.id, trackingId: result.trackingId }
        createdParcelRef.current = parcel
      }

      if (paymentMethod === 'online') {
        if (!parcel.id) throw new Error('The server did not return a parcel ID for payment.')

        const payment = await initializeParcelPayment(parcel.id, token)
        if (!payment.gatewayUrl) throw new Error('The payment gateway URL was not returned.')

        window.location.assign(payment.gatewayUrl)
        return
      }

      resetBooking()
    } catch (error) {
      console.error('Unable to confirm parcel:', error)
      setConfirmError(getRequestErrorMessage(error, 'Failed to save the parcel. Please try again.'))
    } finally {
      setIsConfirming(false)
    }
  }

  return {
    form,
    costInfo,
    quoteError,
    confirmError,
    isQuoting,
    isConfirming,
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
