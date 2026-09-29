import {
  FaBoxesStacked,
  FaBuilding,
  FaClock,
  FaRotateLeft,
  FaTruckFast,
  FaWallet,
} from 'react-icons/fa6'

/**
 * Homepage services.
 *
 * A `.js` file rather than `.json` so `icon` can be a real component reference.
 * The old positional `serviceIcons[index]` lookup broke silently the moment an
 * item was added or reordered, so the icon travels with the data now.
 *
 * `featured` drives the bento span in `ourServices.jsx` (2x2 hero tile), which
 * means the layout is keyed off identity rather than array position.
 */
const services = [
  {
    id: 'express-standard',
    icon: FaClock,
    eyebrow: 'Core service',
    title: 'Express & Standard Delivery',
    description:
      'Book a pickup and your parcel moves on our express lane. Inside Dhaka and the major divisional cities it lands in 48-72 hours, with live tracking the whole way.',
    meta: '48-72 hr delivery',
    featured: true,
    highlights: [
      'Door-to-door pickup from your address',
      'Live tracking from dispatch to doorstep',
      'Proof of delivery on every parcel',
    ],
  },
  {
    id: 'nationwide',
    icon: FaTruckFast,
    eyebrow: 'Coverage',
    title: 'Nationwide Delivery',
    description:
      'One integration, every district. Home delivery nationwide with your customers reached inside 48-72 hours.',
    meta: 'All 64 districts',
  },
  {
    id: 'fulfillment',
    icon: FaBoxesStacked,
    eyebrow: 'Beyond delivery',
    title: 'Fulfillment Solution',
    description:
      'We store your inventory, pick and pack online orders, and handle after-sales.',
    meta: 'Pick - Pack - Support',
  },
  {
    id: 'payment',
    icon: FaWallet,
    eyebrow: 'Payment',
    title: 'Payment Options',
    description:
      'Collect cash at the door, or take payment upfront by card or mobile wallet through SSLCommerz.',
    meta: 'COD · bKash · Nagad · Card',
  },
  {
    id: 'corporate',
    icon: FaBuilding,
    eyebrow: 'Enterprise',
    title: 'Corporate / Contract Logistics',
    description:
      'Dedicated warehouse space, inventory management, and a contract rate built around your volume.',
    meta: 'Custom terms',
  },
  {
    id: 'parcel-return',
    icon: FaRotateLeft,
    eyebrow: 'Reverse logistics',
    title: 'Parcel Return',
    description:
      'Let buyers send items back without shipping to your office. We collect from their door and return to your warehouse.',
    meta: 'Collected from the customer',
  },
]

export default services
