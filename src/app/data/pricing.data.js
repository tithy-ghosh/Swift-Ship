import {
  MdAddCircleOutline,
  MdDescription,
  MdInventory2,
} from 'react-icons/md'

/**
 * Homepage pricing tiers.
 *
 * Lives in the data layer rather than inline in `pricingTiers.jsx` because the
 * tiers are the single most price-sensitive thing on the page. They were
 * originally inlined for the same reason they are not any more: the homepage
 * rendered two independent trees, desktop and mobile, and a component-local copy
 * would have let the two drift with nothing to catch it. The two trees are now
 * one, so this file is no longer load-bearing for that - it stays in the data
 * layer because it is page data, and because moving it back would be churn for
 * no gain.
 *
 * These numbers are a hand-maintained copy of what
 * `AdminSettingsPage` writes to public settings. There is no settings fetch on
 * the homepage, so if the admin changes a rate this file has to be updated by
 * hand too - it is not wired to the live values.
 */
const pricingTiers = [
  {
    id: 'documents',
    icon: MdDescription,
    title: 'Documents',
    price: '৳50 – ৳80',
    note: '৳50 within city · ৳80 outside city',
    blurb: 'Letters, papers, and other lightweight document envelopes.',
  },
  {
    id: 'parcels',
    icon: MdInventory2,
    title: 'Parcels up to 3kg',
    price: '৳80 – ৳130',
    note: '৳80 within city · ৳130 outside city',
    blurb: 'Standard non-document parcels, boxes, and packages.',
  },
  {
    id: 'extra-weight',
    icon: MdAddCircleOutline,
    title: 'Extra weight',
    price: '+৳20 / kg',
    note: 'Plus ৳20 outside-city surcharge',
    blurb: 'For anything heavier than 3kg, charged per additional kilogram.',
  },
]

export default pricingTiers
