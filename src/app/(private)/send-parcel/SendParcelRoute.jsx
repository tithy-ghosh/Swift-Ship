'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import SendParcel from '@/app/components/parcelSending/sendParcel'
import { useParcelBooking } from '@/features/parcels/hooks/useParcelBooking'
import warehouses from '@/app/data/warehouse.data.json'
import { getRegions, getServiceCenters } from '@/utils/warehouse'

const PARCEL_TYPES = new Set(['document', 'non-document'])

/** Picks the first value when a query param arrives as a string or string[]. */
const firstValue = (value) => (Array.isArray(value) ? value[0] : value)

/**
 * Reads the hero rate estimator's query string and returns only values that
 * actually exist in the warehouse data, so a hand-edited URL can never push
 * invalid regions or service centers into the booking form.
 */
const usePrefillFromQuery = () => {
  const searchParams = useSearchParams()
  const regions = useMemo(() => getRegions(warehouses), [])

  return useMemo(() => {
    const prefill = {}

    const senderRegion = firstValue(searchParams.get('senderRegion'))
    if (regions.includes(senderRegion)) {
      prefill.senderRegion = senderRegion

      const senderServiceCenter = firstValue(searchParams.get('senderServiceCenter'))
      if (getServiceCenters(warehouses, senderRegion).includes(senderServiceCenter)) {
        prefill.senderServiceCenter = senderServiceCenter
      }
    }

    const receiverRegion = firstValue(searchParams.get('receiverRegion'))
    if (regions.includes(receiverRegion)) {
      prefill.receiverRegion = receiverRegion

      const receiverServiceCenter = firstValue(searchParams.get('receiverServiceCenter'))
      if (getServiceCenters(warehouses, receiverRegion).includes(receiverServiceCenter)) {
        prefill.receiverServiceCenter = receiverServiceCenter
      }
    }

    const type = firstValue(searchParams.get('type'))
    if (PARCEL_TYPES.has(type)) prefill.type = type

    const weight = Number.parseFloat(firstValue(searchParams.get('weight')))
    if (Number.isFinite(weight) && weight > 0) prefill.weight = String(weight)

    return prefill
  }, [searchParams, regions])
}

export default function SendParcelRoute() {
  const initialValues = usePrefillFromQuery()
  const booking = useParcelBooking(initialValues)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = booking.form

  return (
    <SendParcel
      costInfo={booking.costInfo}
      errors={errors}
      error={booking.quoteError}
      loading={booking.isQuoting}
      handleConfirm={booking.confirmBooking}
      handleSubmit={handleSubmit}
      onCancelConfirm={booking.clearConfirmation}
      onSubmit={booking.submitForQuote}
      parcelType={booking.parcelType}
      receiverRegion={booking.receiverRegion}
      receiverServiceCenters={booking.receiverServiceCenters}
      regions={booking.regions}
      register={register}
      senderRegion={booking.senderRegion}
      senderServiceCenters={booking.senderServiceCenters}
      paymentMethod={booking.paymentMethod}
      onPaymentMethodChange={booking.setPaymentMethod}
      confirmLoading={booking.isConfirming}
      confirmError={booking.confirmError}
    />
  )
}
