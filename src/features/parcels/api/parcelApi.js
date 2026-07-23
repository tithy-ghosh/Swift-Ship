const API_URL = process.env.NEXT_PUBLIC_API_URL

/** Represents an unsuccessful response from the SwiftShip backend. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Reads JSON when available and otherwise creates a useful text-based error.
 * @param {Response} response
 * @returns {Promise<Record<string, any>>}
 */
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return response.json()

  const text = await response.text()
  const isHtml = /^\s*<(?:!doctype|html)/i.test(text)
  return {
    error: isHtml
      ? 'The backend returned a web page instead of API data. Check the configured API URL.'
      : text || 'The backend returned an empty response.',
  }
}

/**
 * Sends an authenticated request and normalizes unsuccessful responses.
 * @param {string} path
 * @param {string} token Firebase ID token.
 * @param {RequestInit} [options]
 */
const request = async (path, token, options = {}) => {
  if (!API_URL) throw new Error('Backend API URL is missing.')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  })
  const data = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError(data.error || data.message || 'The request failed.', response.status)
  }
  return data
}

/** Requests a delivery quote without creating a parcel. */
export const getParcelQuote = (quote, token) =>
  request('/api/parcels/quote', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quote),
  })

/** Persists a confirmed parcel. */
export const createParcel = (parcel, token) =>
  request('/api/parcels', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parcel),
  })

/** Creates an online payment session for an existing parcel. */
export const initializeParcelPayment = (parcelId, token) =>
  request(`/api/payment/init/${parcelId}`, token, { method: 'POST' })

/** Converts transport and API failures into safe messages for the UI. */
export const getRequestErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error instanceof TypeError) {
    return 'Could not connect to the delivery server. Make sure the backend is running and try again.'
  }
  return error?.message || fallback
}
