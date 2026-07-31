import axiosSecure from '@/features/parcels/utils/axiosSecure';
import { AxiosError } from 'axios';

/** Represents an unsuccessful response from the SwiftShip backend. */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** Helper to convert Axios errors into your custom ApiError */
const handleAxiosError = (error) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.error || error.response?.data?.message || error.message;
    throw new ApiError(message, error.response?.status || 500);
  }
  throw error;
};

/** Requests a delivery quote without creating a parcel. */
export const getParcelQuote = async (quote) => {
  try {
    const { data } = await axiosSecure.post('/parcels/quote', quote);
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/** Persists a confirmed parcel. */
export const createParcel = async (parcel) => {
  try {
    const { data } = await axiosSecure.post('/parcels', parcel);
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/** Creates an online payment session for an existing parcel. */
export const initializeParcelPayment = async (parcelId) => {
  try {
    const { data } = await axiosSecure.post(`/api/payment/init/${parcelId}`);
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/** Returns the authenticated user's own payment history. */
export const getMyPaymentHistory = async (page = 1, limit = 20) => {
  try {
    const { data } = await axiosSecure.get(`/api/payment/history/my?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/** Returns the authenticated user's own parcels. */
export const getMyParcels = async () => {
  try {
    const { data } = await axiosSecure.get('/api/parcels/my');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    handleAxiosError(error);
  }
};

/** Deletes a parcel by ID. */
export const deleteMyParcel = async (parcelId) => {
  try {
    const { data } = await axiosSecure.delete(`/api/parcels/${parcelId}`);
    return data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/** Converts transport and API failures into safe messages for the UI. */
export const getRequestErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error instanceof TypeError) {
    return 'Could not connect to the delivery server. Make sure the backend is running and try again.';
  }
  return error?.message || fallback;
};
