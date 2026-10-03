'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  MdBusiness,
  MdCheckCircle,
  MdEmail,
  MdError,
  MdLocationOn,
  MdNotes,
  MdPerson,
  MdPhone,
  MdStorefront,
} from 'react-icons/md';
import { TbBuildingStore, TbTruckDelivery } from 'react-icons/tb';
import { submitMerchantApplication } from '@/features/merchants/api/merchantApi';
import useAuth from '@/app/hooks/useAuth';
import warehouses from '@/app/data/warehouse.data.json';

const DRAFT_KEY = 'swiftship:merchantApplicationDraft';

const BUSINESS_TYPES = [
  'E-commerce store',
  'Retail / grocery',
  'Fashion & apparel',
  'Food & beverage',
  'Electronics',
  'Health & beauty',
  'Other',
];

const MONTHLY_ORDER_BANDS = ['0 - 50', '51 - 200', '201 - 1000', '1000+'];

const getUniqueRegions = () => [...new Set(warehouses.map((w) => w.region))];

const getDistrictsByRegion = (region) => {
  if (!region) return [];
  return [...new Set(warehouses.filter((w) => w.region === region).map((w) => w.district))];
};

const MerchantApplicationForm = () => {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [needsAuth, setNeedsAuth] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      businessName: '',
      businessType: '',
      region: '',
      district: '',
      pickupAddress: '',
      monthlyOrders: '',
      website: '',
      needsCOD: true,
      notes: '',
    },
  });

  const selectedRegion = useWatch({ control, name: 'region' });
  const availableDistricts = getDistrictsByRegion(selectedRegion);

  // Restore a draft saved when a logged-out visitor was asked to sign in, so a
  // trip through /login does not wipe a half-filled application.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) reset((current) => ({ ...current, ...JSON.parse(raw) }));
    } catch {
      // A malformed or unavailable draft is not worth blocking the form over.
    }
  }, [reset]);

  // The account owns the contact name and email. They arrive asynchronously, so
  // they are pushed in once auth resolves rather than seeded in defaultValues.
  useEffect(() => {
    if (user?.displayName) setValue('name', user.displayName);
    if (user?.email) setValue('email', user.email);
  }, [user, setValue]);

  const mutation = useMutation({
    mutationFn: submitMerchantApplication,
    onSuccess: () => {
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Ignore storage failures on the success path.
      }
      setSuccessMsg(
        'Application submitted successfully! Our merchant team will review your store and contact you shortly.',
      );
    },
    onError: (error) => {
      console.error('Merchant application error:', error);
      alert(
        error.response?.data?.error ||
          'Failed to submit your application. Please try again.',
      );
    },
  });

  const onSubmit = (data) => {
    // The gate: anyone may fill the form, only a signed-in user may submit it.
    // Saving the draft first means the sign-in detour costs nothing.
    if (!user) {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch {
        // Non-fatal: the form is still on screen if storage is blocked.
      }
      setNeedsAuth(true);
      return;
    }

    mutation.mutate(data);
  };

  if (successMsg) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-brand-border-subtle bg-white p-8 text-center shadow-sm">
        <MdCheckCircle className="mx-auto size-16 text-brand-accent" />
        <h2 className="mt-4 text-2xl font-bold text-brand-content">Application Received!</h2>
        <p className="mt-2 text-brand-content-muted">{successMsg}</p>
        <p className="mt-4 text-sm font-semibold text-amber-600">Current Status: Pending Review</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-brand-accent-bright px-6 py-2.5 text-sm font-semibold text-brand-surface-inverse-deep transition hover:bg-brand-accent-hover"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-brand-border-subtle bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 border-b border-brand-border-subtle pb-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-brand-content">
          <MdStorefront className="size-6 text-brand-accent" /> Merchant Application
        </h2>
        <p className="mt-1 text-sm text-brand-content-muted">
          Fill this in now — you will be asked to sign in when you submit. Your
          application will be set to <span className="font-semibold text-amber-600">Pending</span>.
        </p>
      </div>

      {needsAuth && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <MdError className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Sign in to submit your application</p>
            <p className="mt-1">
              Your answers are saved on this device. Log in or create an account, then
              submit — you will return right here.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/login?redirect=/be-merchant"
                className="rounded-full bg-brand-accent-bright px-4 py-2 text-sm font-semibold text-brand-surface-inverse-deep transition hover:bg-brand-accent-hover"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Contact info */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="form-control">
          <label className="label-text flex items-center gap-2 pb-2 font-semibold">
            <MdPerson className="size-4 text-brand-accent" /> Contact Name
          </label>
          <input
            type="text"
            {...register('name')}
            readOnly
            placeholder="Sign in to fill automatically"
            className="input input-bordered w-full cursor-not-allowed bg-slate-50 text-slate-500"
          />
        </div>
        <div className="form-control">
          <label className="label-text flex items-center gap-2 pb-2 font-semibold">
            <MdEmail className="size-4 text-brand-accent" /> Email
          </label>
          <input
            type="email"
            {...register('email')}
            readOnly
            placeholder="Sign in to fill automatically"
            className="input input-bordered w-full cursor-not-allowed bg-slate-50 text-slate-500"
          />
        </div>
        <div className="form-control sm:col-span-2">
          <label className="label-text flex items-center gap-2 pb-2 font-semibold">
            <MdPhone className="size-4 text-brand-accent" /> Phone Number
          </label>
          <input
            type="tel"
            {...register('phone', {
              required: 'Phone is required',
              pattern: { value: /^01[3-9]\d{8}$/, message: 'Invalid BD phone number' },
            })}
            className="input input-bordered w-full"
            placeholder="01XXXXXXXXX"
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Business info */}
      <div className="grid gap-5 border-t border-brand-border-subtle pt-6 sm:grid-cols-2">
        <div className="form-control">
          <label className="label-text flex items-center gap-2 pb-2 font-semibold">
            <TbBuildingStore className="size-4 text-brand-accent" /> Business / Store Name
          </label>
          <input
            type="text"
            {...register('businessName', { required: 'Business name is required' })}
            className="input input-bordered w-full"
            placeholder="e.g., Rahim Traders"
          />
          {errors.businessName && (
            <p className="mt-1 text-xs text-red-500">{errors.businessName.message}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label-text flex items-center gap-2 pb-2 font-semibold">
            <MdBusiness className="size-4 text-brand-accent" /> Business Type
          </label>
          <select
            {...register('businessType', { required: 'Business type is required' })}
            className="select select-bordered w-full"
          >
            <option value="">Select type</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.businessType && (
            <p className="mt-1 text-xs text-red-500">{errors.businessType.message}</p>
          )}
        </div>
        <div className="form-control">
          <label className="label-text pb-2 font-semibold">Monthly Order Volume</label>
          <select {...register('monthlyOrders')} className="select select-bordered w-full">
            <option value="">Select a range</option>
            {MONTHLY_ORDER_BANDS.map((band) => (
              <option key={band} value={band}>
                {band} orders
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label-text pb-2 font-semibold">
            Website / Facebook page <span className="text-brand-content-muted">(optional)</span>
          </label>
          <input
            type="text"
            {...register('website')}
            className="input input-bordered w-full"
            placeholder="https://…"
          />
        </div>
      </div>

      {/* Pickup location */}
      <div className="grid gap-5 border-t border-brand-border-subtle pt-6 sm:grid-cols-2">
        <div className="form-control">
          <label className="label-text flex items-center gap-2 pb-2 font-semibold">
            <MdLocationOn className="size-4 text-brand-accent" /> Region
          </label>
          <select
            {...register('region', { required: 'Region is required' })}
            className="select select-bordered w-full"
          >
            <option value="">Select Region</option>
            {getUniqueRegions().map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && <p className="mt-1 text-xs text-red-500">{errors.region.message}</p>}
        </div>
        <div className="form-control">
          <label className="label-text flex items-center gap-2 pb-2 font-semibold">
            <MdLocationOn className="size-4 text-brand-accent" /> District
          </label>
          <select
            {...register('district', { required: 'District is required' })}
            disabled={!selectedRegion}
            className="select select-bordered w-full disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">{selectedRegion ? 'Select District' : 'Select a region first'}</option>
            {availableDistricts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="mt-1 text-xs text-red-500">{errors.district.message}</p>
          )}
        </div>
        <div className="form-control sm:col-span-2">
          <label className="label-text flex items-center gap-2 pb-2 font-semibold">
            <MdLocationOn className="size-4 text-brand-accent" /> Pickup Address
          </label>
          <textarea
            rows="2"
            {...register('pickupAddress', { required: 'Pickup address is required' })}
            className="textarea textarea-bordered w-full"
            placeholder="Where should riders collect your parcels?"
          />
          {errors.pickupAddress && (
            <p className="mt-1 text-xs text-red-500">{errors.pickupAddress.message}</p>
          )}
        </div>
      </div>

      {/* Extras */}
      <div className="space-y-4 border-t border-brand-border-subtle pt-6">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            {...register('needsCOD')}
            className="checkbox checkbox-sm mt-1 border-brand-accent-bright"
          />
          <span className="text-sm text-brand-content">
            I need cash-on-delivery (COD) collection and remittance.
          </span>
        </label>
        <div className="form-control">
          <label className="label-text flex items-center gap-2 pb-2 font-semibold">
            <MdNotes className="size-4 text-brand-accent" /> Anything else?
            <span className="text-brand-content-muted">(optional)</span>
          </label>
          <textarea
            rows="3"
            {...register('notes')}
            className="textarea textarea-bordered w-full"
            placeholder="Expected pickup times, return handling, special requirements…"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className="btn mt-4 w-full border-none bg-brand-accent-bright font-bold text-brand-surface-inverse-deep hover:bg-brand-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mutation.isPending ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Submitting Application…
          </>
        ) : (
          <span className="inline-flex items-center gap-2">
            <TbTruckDelivery className="size-5" /> Submit Application
          </span>
        )}
      </button>
    </form>
  );
};

export default MerchantApplicationForm;
