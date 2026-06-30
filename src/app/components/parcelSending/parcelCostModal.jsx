import { MdArrowForward, MdLocalShipping, MdOutlineReceiptLong } from 'react-icons/md'

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

const ParcelCostModal = ({ costInfo, handleConfirm, onCancelConfirm }) => {
  if (!costInfo) {
    return null
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-3xl overflow-visible bg-base-200 p-0 shadow-2xl">
        <div className="bg-base-100 px-5 pb-3 pt-5 text-center sm:px-8">
          <p className="text-xs font-bold uppercase tracking-wide text-[#4d8d41]">Parcel Quote</p>
          <h2 className="mt-1 text-2xl font-black text-base-content sm:text-3xl">Review Parcel Charge</h2>
          <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-base-content/70 sm:text-sm">
            Confirm the route, parcel facts, and delivery charge before moving to payment.
          </p>
        </div>

        <div className="px-3 py-3 sm:px-5">
          <CostBreakdown
            items={costInfo.costBreakdown || []}
            parcelData={costInfo.parcelData}
            total={costInfo.deliveryCost}
          />
        </div>

        <div className="modal-action mt-0 border-t border-base-300 bg-base-100 px-5 py-3">
          <button type="button" onClick={onCancelConfirm} className="btn btn-sm btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn btn-sm border-0 bg-[#83BD75] font-semibold text-[#172015] hover:bg-[#74ad68]"
          >
            Proceed to Payment
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
