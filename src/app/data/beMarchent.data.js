/**
 * Become a merchant.
 *
 * Only claims that survive an audit are kept here.
 *
 * Cut: "48h average onboarding", "Same-day pickup support", and "Dedicated
 * merchant dashboard". None were backed by anything in the codebase - there is
 * no merchant dashboard route at all (the only `dashboard/` is the sender's own
 * "All Shipments" list), and no onboarding SLA is defined anywhere. `64+
 * delivery zones` and `24/7 merchant support` are both real, so they are the
 * two stats that stay.
 *
 * `cta.steps` and `process` were removed with the old right-hand column. They
 * described a merchant onboarding flow that has not been built, and leaving
 * them here would keep dead copy alive in the data layer.
 */
const beMarchentData = {
  eyebrow: 'Partner with SwiftShip',
  title: 'Become a merchant and ship orders without delivery stress.',
  description:
    'Connect your store with a delivery flow built for growing sellers: pickup scheduling, parcel tracking, cash collection, returns, and support from one reliable team.',
  benefits: [
    'COD and return handling',
    'Live tracking for every order',
    'One dashboard for your parcels',
  ],
  stats: [
    {
      value: '64+',
      label: 'delivery zones',
    },
    {
      value: '24/7',
      label: 'merchant support',
    },
  ],
  cta: {
    title: 'Ready to grow?',
    subtitle: 'Start with a quick merchant call',
    description:
      'Tell us about your business and our merchant team will help you choose the best delivery plan for your orders.',
    buttonLabel: 'Become a merchant',
  },
}

export default beMarchentData
