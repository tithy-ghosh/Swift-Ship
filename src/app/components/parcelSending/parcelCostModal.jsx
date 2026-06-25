import { MdTaskAlt } from 'react-icons/md'

const DetailItem = ({ label, value }) => {
  return (
    <div className="rounded-lg bg-base-200 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-base-content">{value || 'Not provided'}</p>
    </div>
  )
}

const DetailGroup = ({ title, children }) => {
  return (
    <section>
      <h3 className="mb-3 text-lg font-bold text-base-content">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  )
}

const CostBreakdown = ({ items, total }) => {
  return (
    <section className="rounded-lg border border-[#83BD75]/40 bg-[#f6fbf4] p-4">
      <div className="flex flex-col gap-1 border-b border-[#83BD75]/30 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-base-content">Delivery Cost Breakdown</h3>
          <p className="text-sm text-base-content/70">Here is how this delivery charge is calculated.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-start justify-between gap-4 text-sm">
            <span className="leading-6 text-base-content/75">{item.label}</span>
            <span className="shrink-0 font-semibold text-base-content">BDT {item.amount}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-lg bg-[#83BD75] px-4 py-3 text-[#172015]">
        <span className="text-sm font-bold uppercase tracking-wide">Total Delivery Cost</span>
        <span className="text-2xl font-black">BDT {total}</span>
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
      <div className="modal-box max-h-[90vh] max-w-5xl overflow-y-auto">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#eef7eb] text-[#4d8d41]">
            <MdTaskAlt className="size-6" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#4d8d41]">Confirm Parcel</p>
            <h2 className="mt-1 text-2xl font-bold">Review Delivery Charge</h2>
            <p className="mt-2 text-sm leading-6 text-base-content/70">
              Review the parcel, sender, and receiver details before confirming.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <DetailGroup title="Parcel Details">
            <DetailItem label="Type" value={costInfo.parcelData.type} />
            <DetailItem label="Title" value={costInfo.parcelData.title} />
            <DetailItem
              label="Weight"
              value={costInfo.parcelData.weight ? `${costInfo.parcelData.weight} kg` : 'Not added'}
            />
            <DetailItem label="Delivery Zone" value={costInfo.parcelData.deliveryZone} />
            <DetailItem label="Delivery Cost" value={`BDT ${costInfo.deliveryCost}`} />
          </DetailGroup>

          <DetailGroup title="Sender Details">
            <DetailItem label="Name" value={costInfo.parcelData.senderName} />
            <DetailItem label="Contact" value={costInfo.parcelData.senderContact} />
            <DetailItem label="Region" value={costInfo.parcelData.senderRegion} />
            <DetailItem label="Service Center" value={costInfo.parcelData.senderServiceCenter} />
            <DetailItem label="Address" value={costInfo.parcelData.senderAddress} />
            <DetailItem label="Pick up Instruction" value={costInfo.parcelData.pickupInstruction} />
          </DetailGroup>

          <DetailGroup title="Receiver Details">
            <DetailItem label="Name" value={costInfo.parcelData.receiverName} />
            <DetailItem label="Contact" value={costInfo.parcelData.receiverContact} />
            <DetailItem label="Region" value={costInfo.parcelData.receiverRegion} />
            <DetailItem label="Service Center" value={costInfo.parcelData.receiverServiceCenter} />
            <DetailItem label="Address" value={costInfo.parcelData.receiverAddress} />
            <DetailItem label="Delivery Instruction" value={costInfo.parcelData.deliveryInstruction} />
          </DetailGroup>

          <CostBreakdown items={costInfo.costBreakdown || []} total={costInfo.deliveryCost} />
        </div>

        <div className="modal-action">
          <button type="button" onClick={onCancelConfirm} className="btn btn-ghost">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="btn border-0 bg-[#83BD75] font-semibold text-[#172015] hover:bg-[#74ad68]"
          >
            Confirm
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
