import trackingImage from '@/app/assets/Transit-warehouse.png'
import supportImage from '@/app/assets/live-chat.png'
import safeDeliveryImage from '@/app/assets/heroBanner.png'

const specialities = [
  {
    eyebrow: 'Delivery visibility',
    title: 'Live parcel tracking',
    description:
      'Keep every shipment visible from pickup to doorstep with real-time parcel updates, delivery progress, and clear status changes for your team and customers.',
    image: trackingImage,
    imageAlt: 'Live parcel tracking illustration',
  },
  {
    eyebrow: 'Always available',
    title: '24/7 call support',
    description:
      'Get help whenever deliveries need attention with round-the-clock support for parcel updates, customer questions, and urgent shipment issues.',
    image: supportImage,
    imageAlt: 'Customer support illustration',
  },
  {
    eyebrow: 'Secure handling',
    title: '100% safe delivery',
    description:
      'Protect every order with careful parcel handling, secure delivery practices, and reliable handoff from pickup through final destination.',
    image: safeDeliveryImage,
    imageAlt: 'Safe delivery illustration',
  },
]

export default specialities
