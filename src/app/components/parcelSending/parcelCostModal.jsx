import {
  MdArrowForward,
  MdCheckCircle,
  MdCreditCard,
  MdLocalAtm,
  MdLocalShipping,
  MdLockOutline,
  MdOutlineReceiptLong,
  MdPayments,
  MdPhoneAndroid,
} from 'react-icons/md'

const InfoPill = ({ label, value }) => {
  return (
    <div className="rounded-lg border border-[#d9ebd4] bg-white px-3 py-2">
      <p className="text-[0.65rem] font-bold uppercase tracking-wide text-base-content/50">{label}</p>
      <p className="mt-0.5 truncate text-xs font-bold text-base-content sm:text-sm">{value || 'Not added'}</p>
    </div>
  )
}

const RoutePoint = ({ label, value }) => {
  return (
    <div className="min-w-0">
      <p className="text-[0.65rem] font-bold uppercase tracking-wide text-base-content/50">{label}</p>
      <p className="mt-0.5 truncate text-sm font-black text-base-content">{value || 'Not selected'}</p>
    </div>
  )
}

const CostBreakdown = ({ items, parcelData, total }) => {
  return (
    <section className="overflow-hidden rounded-lg border border-[#83BD75]/50 bg-[#f7fcf4] shadow-[0_18px_45px_rgba(77,141,65,0.16)]">
      <div className="border-b border-[#d9ebd4] bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eef7eb] text-[#4d8d41]">
            <MdLocalShipping className="size-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#4d8d41]">Delivery Route</p>
            <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <RoutePoint label="Pickup" value={parcelData.senderServiceCenter} />
              <span className="flex size-7 items-center justify-center rounded-full bg-[#f7fcf4] text-[#4d8d41]">
                <MdArrowForward className="size-4" />
              </span>
              <RoutePoint label="Drop-off" value={parcelData.receiverServiceCenter} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-2 px-4 py-3 sm:grid-cols-4">
        <InfoPill label="Parcel" value={parcelData.type} />
        <InfoPill label="Weight" value={parcelData.weight ? `${parcelData.weight} kg` : 'Not added'} />
        <InfoPill label="Zone" value={parcelData.deliveryZone} />
        <InfoPill label="Quote" value={`BDT ${total}`} />
      </div>

      <div className="mx-4 rounded-lg border border-[#d9ebd4] bg-white">
        <div className="flex items-center gap-2 border-b border-[#edf5ea] px-3 py-2">
          <MdOutlineReceiptLong className="size-5 text-[#4d8d41]" />
          <p className="text-sm font-black text-base-content">Charge Details</p>
        </div>

        <div className="divide-y divide-[#edf5ea]">
          {items.map((item) => (
            <div key={item.label} className="flex items-start justify-between gap-3 px-3 py-2 text-xs sm:text-sm">
              <span className="leading-5 text-base-content/70">{item.label}</span>
              <span className="shrink-0 font-black text-base-content">BDT {item.amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 bg-[#A5CF83] px-4 py-3 text-white">
        <div className="flex flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wide text-[#091413] sm:text-sm">Amount to Pay</span>
          <span className="text-2xl font-black sm:text-3xl  text-[#091413]">BDT {total}</span>
        </div>
      </div>
    </section>
  )
}

const PAYMENT_OPTIONS = [
  {
    value: 'cod',
    icon: MdLocalAtm,
    title: 'Cash on Delivery',
    description: 'Pay in cash when the parcel is picked up or delivered.',
  },
  {
    value: 'online',
    icon: MdPayments,
    title: 'Pay Online',
    description: 'Complete payment securely through SSLCommerz.',
  },
]

const ONLINE_CHANNELS = [
  { name: 'bKash', type: 'Mobile wallet', color: 'bg-[#e2136e]', icon: MdPhoneAndroid },
  { name: 'Nagad', type: 'Mobile wallet', color: 'bg-[#ed1c24]', icon: MdPhoneAndroid },
  { name: 'Rocket', type: 'Mobile wallet', color: 'bg-[#8b2a88]', icon: MdPhoneAndroid },
  { name: 'Card', type: 'Visa · Mastercard', color: 'bg-[#087f5b]', icon: MdCreditCard },
]

const PaymentMethodPicker = ({ paymentMethod, onPaymentMethodChange }) => (
  <section className="mt-3 overflow-hidden rounded-2xl border border-[#dce8d8] bg-white shadow-sm">
    <div className="flex items-center justify-between gap-3 border-b border-[#e8f0e5] px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#eef7eb] text-[#4d8d41]">
          <MdPayments className="size-5" />
        </span>
        <div>
          <p className="text-sm font-black text-base-content">How would you like to pay?</p>
          <p className="text-[11px] text-base-content/55">Choose one option to continue</p>
        </div>
      </div>
      <span className="hidden items-center gap-1 rounded-full bg-[#f1f8ef] px-2.5 py-1 text-[11px] font-bold text-[#3e7735] sm:flex">
        <MdLockOutline className="size-3.5" /> Secure
      </span>
    </div>
    <div className="grid gap-3 p-4 sm:grid-cols-2">
      {PAYMENT_OPTIONS.map(({ value, icon: Icon, title, description }) => {
        const isSelected = paymentMethod === value
        return (
          <label
            key={value}
            className={`relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition-all ${
              isSelected
                ? 'border-[#83BD75] bg-[#f5fbf2] shadow-[0_8px_24px_rgba(77,141,65,0.1)]'
                : 'border-slate-200 bg-white hover:border-[#83BD75]/60'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={value}
              checked={isSelected}
              onChange={() => onPaymentMethodChange(value)}
              className="sr-only"
            />
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
              isSelected ? 'bg-[#83BD75] text-[#172015]' : 'bg-slate-100 text-slate-500'
            }`}>
              <Icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-base-content">{title}</span>
              <span className="mt-0.5 block text-xs leading-5 text-base-content/60">{description}</span>
            </span>
            {isSelected && <MdCheckCircle className="absolute right-2.5 top-2.5 size-5 text-[#4d8d41]" />}
          </label>
        )
      })}
    </div>

    {paymentMethod === 'online' && (
      <div className="border-t border-[#e8f0e5] bg-[#fafcf9] px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-base-content/70">Available at secure checkout</p>
            <p className="mt-0.5 text-[11px] text-base-content/50">Select your provider on the next screen</p>
          </div>
          <span className="rounded-full border border-[#d9ead4] bg-white px-2.5 py-1 text-[10px] font-bold text-[#4d8d41]">
            SSLCommerz
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ONLINE_CHANNELS.map(({ name, type, color, icon: Icon }) => (
            <div key={name} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <span className={`flex size-8 items-center justify-center rounded-lg text-white ${color}`}>
                <Icon className="size-4" />
              </span>
              <p className="mt-2 text-sm font-black text-slate-800">{name}</p>
              <p className="mt-0.5 truncate text-[10px] font-medium text-slate-400">{type}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#edf7ea] px-3 py-2.5 text-[11px] leading-4 text-[#365f30]">
          <MdLockOutline className="mt-0.5 size-4 shrink-0" />
          <p>
            Your mobile number, OTP, PIN, or card information is entered only on SSLCommerz&apos;s secure page.
            SwiftShip never collects or stores it.
          </p>
        </div>
      </div>
    )}
  </section>
)

/**
 * Displays a quote and payment choice in a viewport-safe dialog.
 * The body scrolls independently so actions remain reachable on short screens.
 */
const ParcelCostModal = ({
  costInfo,
  handleConfirm,
  onCancelConfirm,
  paymentMethod,
  onPaymentMethodChange,
  loading,
  error,
}) => {
  if (!costInfo) {
    return null
  }

  const confirmLabel =
    paymentMethod === 'online' ? 'Continue to Secure Payment' : 'Confirm Cash on Delivery'

  return (
    <div className="modal modal-open p-3 sm:p-5">
      <div className="modal-box flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden bg-base-200 p-0 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)]">
        <div className="shrink-0 bg-base-100 px-4 pb-3 pt-4 text-center sm:px-6">
          <p className="text-xs font-bold uppercase tracking-wide text-[#4d8d41]">Parcel Quote</p>
          <h2 className="mt-1 text-xl font-black text-base-content sm:text-2xl">Review Parcel Charge</h2>
          <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-base-content/70 sm:text-sm">
            Confirm the route, parcel facts, and delivery charge, then choose how you&apos;d like to pay.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-5">
          <CostBreakdown
            items={costInfo.costBreakdown || []}
            parcelData={costInfo.parcelData}
            total={costInfo.deliveryCost}
          />
          <PaymentMethodPicker
            paymentMethod={paymentMethod}
            onPaymentMethodChange={onPaymentMethodChange}
          />
          {error && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 sm:text-sm">
              {error}
            </p>
          )}
        </div>

        <div className="modal-action mt-0 shrink-0 border-t border-base-300 bg-base-100 px-4 py-3 sm:px-5">
          <button type="button" onClick={onCancelConfirm} disabled={loading} className="btn btn-sm btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="btn btn-sm border-0 bg-[#83BD75] font-semibold text-[#172015] hover:bg-[#74ad68] disabled:opacity-70"
          >
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        onClick={onCancelConfirm}
        aria-label="Close parcel confirmation modal"
      >
        Close
      </button>
    </div>
  )
}

export default ParcelCostModal
