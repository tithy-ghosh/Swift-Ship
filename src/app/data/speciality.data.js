import trackingImage from '@/app/assets/Transit-warehouse.png'
import supportImage from '@/app/assets/live-chat.png'
import safeDeliveryImage from '@/app/assets/safe-delivery.png'

/**
 * "Why SwiftShip" differentiators.
 *
 * The three descriptions run deliberately uneven in length (short / medium /
 * long). The originals were all ~140 characters opening "Keep every...",
 * "Get help whenever...", "Protect every...", which read as three variations on
 * the same filler sentence once they were side by side in a grid.
 *
 * Titles avoid guarantees. This was previously "24/7 call support" and "100%
 * safe delivery", neither of which anything in the codebase backs. Live
 * tracking is the one claim that holds - there is a `/track` route.
 */
const specialities = [
  {
    eyebrow: 'Delivery visibility',
    title: 'Live parcel tracking',
    description:
      'Keep every shipment visible from pickup to doorstep, with live status updates your customers can check themselves.',
    image: trackingImage,
    imageAlt: 'Live parcel tracking illustration',
  },
  {
    eyebrow: 'Human support',
    title: 'Support when you need it',
    description:
      'Message us whenever a delivery needs attention. Real people handle parcel updates, delivery questions, and the awkward cases that need a human.',
    image: supportImage,
    imageAlt: 'Customer support illustration',
  },
  {
    eyebrow: 'Secure handling',
    title: 'Careful handling, end to end',
    description:
      'Every parcel is handled the same way, whatever is inside: checked, tracked, and handed off deliberately at each step, so problems surface early instead of at the door. You keep a record of what happened and when.',
    image: safeDeliveryImage,
    imageAlt: 'Safe delivery illustration',
  },
]

export default specialities
