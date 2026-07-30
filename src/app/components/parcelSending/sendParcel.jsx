import { MdInventory2, MdLocalShipping, MdOutlinePerson } from 'react-icons/md'
import ParcelCostModal from './parcelCostModal'

/**
 * Presentational parcel form. Booking state and API side effects are injected
 * by the route so this component stays focused on fields and validation UI.
 */
const FieldError = ({ children }) => {
  return <p className="mt-1 text-sm font-medium text-error">{children}</p>
}

const SectionTitle = ({ icon: Icon, title }) => {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-base-300 pb-3">
      <span className="flex size-10 items-center justify-center rounded-lg bg-[#eef7eb] text-[#4d8d41]">
        <Icon className="size-5" />
      </span>
      <h2 className="text-xl font-bold text-base-content">{title}</h2>
    </div>
  )
}

const SendParcel = ({
  costInfo,
  errors,
  error,
  loading,
  handleConfirm,
  handleSubmit,
  onCancelConfirm,
  onSubmit,
  parcelType,
  receiverRegion,
  receiverServiceCenters,
  regions,
  register,
  senderRegion,
  senderServiceCenters,
  paymentMethod,
  onPaymentMethodChange,
  confirmLoading,
  confirmError,
}) => {
  return (
    <main className="text-base-content">
      <section>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#4d8d41]">Send a Percel</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
            Book a door to door delivery
          </h1>
          <p className="mt-3 text-base leading-7 text-base-content/70">
            Add pickup and delivery details to calculate the parcel cost before confirming the request.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <section className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6 ">
            <SectionTitle icon={MdInventory2} title="Parcel Info" />

            <div className="grid gap-5 md:grid-cols-3 ">
              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Type</span>
                <select className="select select-bordered w-full" {...register('type', { required: true })}>
                  <option value="document">Document</option>
                  <option value="non-document">Non-document</option>
                </select>
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Parcel Name</span>
                <input
                  type="text"
                  placeholder="Describe Your Parcel"
                  className="input input-bordered w-full"
                  {...register('title', { required: 'Parcel title is required' })}
                />
                {errors.title && <FieldError>{errors.title.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Weight</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="Weight in kg"
                  className="input input-bordered w-full disabled:border-base-300 disabled:bg-base-200 disabled:text-base-content/50"
                  disabled={parcelType === 'document'}
                  {...register('weight')}
                />
                {parcelType === 'document' && (
                  <p className="mt-1 text-sm text-base-content/60">Weight is only needed for non-document parcels.</p>
                )}
              </label>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
              <SectionTitle icon={MdOutlinePerson} title="Sender Info" />

              <div className="grid gap-5 xl:grid-cols-2">
              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Name</span>
                <input
                  type="text"
                  placeholder="Sender name"
                  className="input input-bordered w-full"
                  {...register('senderName', { required: 'Sender name is required' })}
                />
                {errors.senderName && <FieldError>{errors.senderName.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Contact</span>
                <input
                  type="tel"
                  placeholder="Sender contact number"
                  className="input input-bordered w-full"
                  {...register('senderContact', { required: 'Sender contact is required' })}
                />
                {errors.senderContact && <FieldError>{errors.senderContact.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Select Region</span>
                <select
                  className="select select-bordered w-full"
                  {...register('senderRegion', { required: 'Sender region is required' })}
                >
                  <option value="">Choose region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.senderRegion && <FieldError>{errors.senderRegion.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Select Service Center</span>
                <select
                  className="select select-bordered w-full"
                  disabled={!senderRegion}
                  {...register('senderServiceCenter', {
                    required: 'Sender service center is required',
                  })}
                >
                  <option value="">Choose service center</option>
                  {senderServiceCenters.map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
                {errors.senderServiceCenter && <FieldError>{errors.senderServiceCenter.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Address</span>
                <textarea
                  placeholder="Pickup address"
                  className="textarea textarea-bordered min-h-28 w-full resize-none"
                  {...register('senderAddress', { required: 'Sender address is required' })}
                />
                {errors.senderAddress && <FieldError>{errors.senderAddress.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Pick up Instruction</span>
                <textarea
                  placeholder="Pickup instruction"
                  className="textarea textarea-bordered min-h-28 w-full resize-none"
                  {...register('pickupInstruction', {
                    required: 'Pickup instruction is required',
                  })}
                />
                {errors.pickupInstruction && <FieldError>{errors.pickupInstruction.message}</FieldError>}
              </label>
              </div>
            </section>

            <section className="rounded-lg border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
              <SectionTitle icon={MdLocalShipping} title="Receiver Info" />

              <div className="grid gap-5 xl:grid-cols-2">
              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Name</span>
                <input
                  type="text"
                  placeholder="Receiver name"
                  className="input input-bordered w-full"
                  {...register('receiverName', { required: 'Receiver name is required' })}
                />
                {errors.receiverName && <FieldError>{errors.receiverName.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Contact</span>
                <input
                  type="tel"
                  placeholder="Receiver contact number"
                  className="input input-bordered w-full"
                  {...register('receiverContact', { required: 'Receiver contact is required' })}
                />
                {errors.receiverContact && <FieldError>{errors.receiverContact.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Select Region</span>
                <select
                  className="select select-bordered w-full"
                  {...register('receiverRegion', { required: 'Receiver region is required' })}
                >
                  <option value="">Choose region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
                {errors.receiverRegion && <FieldError>{errors.receiverRegion.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Select Service Center</span>
                <select
                  className="select select-bordered w-full"
                  disabled={!receiverRegion}
                  {...register('receiverServiceCenter', {
                    required: 'Receiver service center is required',
                  })}
                >
                  <option value="">Choose service center</option>
                  {receiverServiceCenters.map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
                {errors.receiverServiceCenter && <FieldError>{errors.receiverServiceCenter.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Address</span>
                <textarea
                  placeholder="Delivery address"
                  className="textarea textarea-bordered min-h-28 w-full resize-none"
                  {...register('receiverAddress', { required: 'Receiver address is required' })}
                />
                {errors.receiverAddress && <FieldError>{errors.receiverAddress.message}</FieldError>}
              </label>

              <label className="form-control">
                <span className="label-text pb-2 font-semibold">Delivery Instruction</span>
                <textarea
                  placeholder="Delivery instruction"
                  className="textarea textarea-bordered min-h-28 w-full resize-none"
                  {...register('deliveryInstruction', {
                    required: 'Delivery instruction is required',
                  })}
                />
                {errors.deliveryInstruction && <FieldError>{errors.deliveryInstruction.message}</FieldError>}
              </label>
              </div>
            </section>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn border-0 bg-[#83BD75] px-8 font-semibold text-[#172015] hover:bg-[#74ad68] disabled:opacity-70"
            >
              {loading ? 'Please wait…' : 'Submit'}
            </button>
          </div>
        </form>
      </section>

      <ParcelCostModal
        costInfo={costInfo}
        handleConfirm={handleConfirm}
        onCancelConfirm={onCancelConfirm}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
        loading={confirmLoading}
        error={confirmError}
      />
    </main>
  )
}

export default SendParcel
