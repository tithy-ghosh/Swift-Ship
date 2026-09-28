export const DEFAULT_PAYMENT_METHOD = 'cod'

/**
 * Returns fresh form defaults so React Hook Form never shares mutable state.
 * @param {string} [senderName]
 * @param {Partial<ReturnType<typeof createParcelFormDefaults>>} [overrides]
 */
export const createParcelFormDefaults = (senderName = '', overrides = {}) => ({
  type: 'document',
  title: '',
  weight: '',
  senderName,
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
  ...overrides,
})
