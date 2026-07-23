# Parcel booking feature

This folder contains the business logic for the parcel quote and payment flow.
Route files and components should remain focused on rendering.

## Structure

- `api/parcelApi.js` is the only module that talks to the parcel backend. It
  applies authentication headers, parses responses, and normalizes API errors.
- `config/parcelForm.js` owns stable defaults and payment constants.
- `hooks/useParcelBooking.js` coordinates the quote, parcel creation, and
  payment state machine.
- `utils/warehouse.js` contains pure location selectors.

The visual form and modal currently live in
`src/app/components/parcelSending`. They receive data and callbacks from the
feature hook and do not call the backend directly.

## Booking sequence

1. `submitForQuote` requests a price without creating a database record.
2. The customer reviews the quote and selects COD or online payment.
3. `confirmBooking` creates the parcel once.
4. COD resets the form. Online payment creates a gateway session and redirects.

The created parcel is retained in a ref when payment setup fails. Retrying the
payment therefore does not create duplicate parcel records.

## Extension guidelines

- Add or change endpoints in `api/parcelApi.js`, not in React components.
- Keep warehouse transformations pure and deterministic.
- Put workflow state in `useParcelBooking`; keep components presentational.
- Surface backend errors through `getRequestErrorMessage` so users receive
  consistent messages.
