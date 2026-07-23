'use client'

import SendParcel from '@/app/components/parcelSending/sendParcel'
import { useParcelBooking } from '@/features/parcels/hooks/useParcelBooking'

/**
 * Route composition for parcel booking.
 *
 * Business state lives in useParcelBooking; this component only connects that
 * workflow to the presentational form.
 */
export default function SendParcelPage() {
  const booking = useParcelBooking()
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
