'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { submitRiderApplication } from '@/features/riders/api/riderApi';
import useAuth from '@/app/hooks/useAuth';
import warehouses from '@/app/data/warehouse.data.json';
import { MdCheckCircle, MdError, MdBikeScooter, MdPerson, MdPhone, MdLocationOn, MdBadge, MdTimelapse } from 'react-icons/md';
import { TbMotorbike } from 'react-icons/tb';



const getUniqueRegions = () => {
  return [...new Set(warehouses.map(w => w.region))];
};

const getDistrictsByRegion = (region) => {
  if (!region) return [];
  // Filter by region, map to district, and remove duplicates
  return [...new Set(warehouses.filter(w => w.region === region).map(w => w.district))];
};

export default function BeARiderForm() {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      age: '',
      region: '',
      district: '',
      phone: '',
      nid: '',
      bikeBrand: '',
      bikeRegNumber: '',
      licenseNumber: '',
      experience: 0,
    }
  });

  const selectedRegion = watch('region');
  const availableDistricts = getDistrictsByRegion(selectedRegion);

  const mutation = useMutation({
    mutationFn: submitRiderApplication,
    onSuccess: () => {
      setSuccessMsg('Application submitted successfully! We will review your details shortly.');
    },
    onError: (error) => {
      console.error('Submission error:', error);
      alert(error.response?.data?.error || 'Failed to submit application. Please try again.');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (successMsg) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-white rounded-2xl shadow-sm border border-[#dce8d8]">
        <MdCheckCircle className="mx-auto size-16 text-[#4d8d41]" />
        <h2 className="mt-4 text-2xl font-bold text-[#1f2a1d]">Application Received!</h2>
        <p className="mt-2 text-[#596257]">{successMsg}</p>
        <p className="mt-4 text-sm font-semibold text-amber-600">Current Status: Pending Review</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#dce8d8]">
      <div className="border-b border-[#e8f0e5] pb-4 mb-6">
        <h2 className="text-2xl font-bold text-[#1f2a1d]">Rider Application Form</h2>
        <p className="text-sm text-[#596257] mt-1">Please fill out all details accurately. Your application status will be set to <span className="font-semibold text-amber-600">Pending</span>.</p>
      </div>

      {/* Personal Info */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="form-control">
          <label className="label-text pb-2 font-semibold flex items-center gap-2">
            <MdPerson className="size-4 text-[#4d8d41]" /> Full Name
          </label>
          <input 
            type="text" 
            {...register('name', { required: true })} 
            readOnly 
            className="input input-bordered w-full bg-slate-50 text-slate-500 cursor-not-allowed" 
          />
        </div>
        <div className="form-control">
          <label className="label-text pb-2 font-semibold flex items-center gap-2">
            <MdPerson className="size-4 text-[#4d8d41]" /> Email
          </label>
          <input 
            type="email" 
            {...register('email', { required: true })} 
            readOnly 
            className="input input-bordered w-full bg-slate-50 text-slate-500 cursor-not-allowed" 
          />
        </div>
        <div className="form-control">
          <label className="label-text flex items-center pb-2 gap-2 font-semibold">
            <MdTimelapse className="size-4 text-[#4d8d41]" />
            Age</label>
          <input 
            type="number" 
            min="18" 
            {...register('age', { required: 'Age is required', min: { value: 18, message: 'Must be at least 18' } })} 
            className="input input-bordered w-full" 
          />
          {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
        </div>
        <div className="form-control">
          <label className="label-text pb-2 font-semibold flex items-center gap-2">
            <MdPhone className="size-4 text-[#4d8d41]" /> Phone Number
          </label>
          <input 
            type="tel" 
            {...register('phone', { required: 'Phone is required', pattern: { value: /^01[3-9]\d{8}$/, message: 'Invalid BD phone number' } })} 
            className="input input-bordered w-full" 
            placeholder="01XXXXXXXXX"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div className="form-control sm:col-span-2">
          <label className="label-text pb-2 font-semibold flex items-center gap-2">
            <MdBadge className="size-4 text-[#4d8d41]" /> NID Card Number
          </label>
          <input 
            type="text" 
            {...register('nid', { required: 'NID is required' })} 
            className="input input-bordered w-full" 
            placeholder="Enter your 10 or 13 digit NID"
          />
          {errors.nid && <p className="text-red-500 text-xs mt-1">{errors.nid.message}</p>}
        </div>
      </div>

      {/* Location Info (Using your warehouse.data.json) */}
      <div className="grid gap-5 sm:grid-cols-2 border-t border-[#e8f0e5] pt-6">
        <div className="form-control">
          <label className="label-text pb-2 font-semibold flex items-center gap-2">
            <MdLocationOn className="size-4 text-[#4d8d41]" /> Region
          </label>
          <select 
            {...register('region', { required: 'Region is required' })} 
            className="select select-bordered w-full"
          >
            <option value="">Select Region</option>
            {getUniqueRegions().map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region.message}</p>}
        </div>
        <div className="form-control">
          <label className="label-text pb-2 font-semibold flex items-center gap-2">
            <MdLocationOn className="size-4 text-[#4d8d41]" /> District
          </label>
          <select 
            {...register('district', { required: 'District is required' })} 
            disabled={!selectedRegion} 
            className="select select-bordered w-full disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">{selectedRegion ? 'Select District' : 'Select a region first'}</option>
            {availableDistricts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
        </div>
      </div>

      {/* Bike & License Info */}
      <div className="grid gap-5 sm:grid-cols-2 border-t border-[#e8f0e5] pt-6">
        <div className="form-control">
          <label className="label-text pb-2 font-semibold flex items-center gap-2">
            <TbMotorbike className="size-4 text-[#4d8d41]" /> Bike Brand
          </label>
          <input 
            type="text" 
            {...register('bikeBrand', { required: 'Bike brand is required' })} 
            className="input input-bordered w-full" 
            placeholder="e.g., Honda, Yamaha, Bajaj"
          />
          {errors.bikeBrand && <p className="text-red-500 text-xs mt-1">{errors.bikeBrand.message}</p>}
        </div>
        <div className="form-control">
          <label className="label-text pb-2 font-semibold flex items-center gap-2">
            <TbMotorbike className="size-4 text-[#4d8d41]" /> Bike Registration No.
          </label>
          <input 
            type="text" 
            {...register('bikeRegNumber', { required: 'Registration number is required' })} 
            className="input input-bordered w-full" 
            placeholder="e.g., Dhaka Metro-Ga-12-3456"
          />
          {errors.bikeRegNumber && <p className="text-red-500 text-xs mt-1">{errors.bikeRegNumber.message}</p>}
        </div>
        <div className="form-control">
          <label className="label-text pb-2 font-semibold flex items-center gap-2">
            <MdBadge className="size-4 text-[#4d8d41]" /> Driving License No.
          </label>
          <input 
            type="text" 
            {...register('licenseNumber', { required: 'License number is required' })} 
            className="input input-bordered w-full" 
          />
          {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber.message}</p>}
        </div>
        <div className="form-control">
          <label className="label-text pb-2 font-semibold">Years of Riding Experience</label>
          <input 
            type="number" 
            min="0" 
            {...register('experience')} 
            className="input input-bordered w-full" 
            placeholder="0"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn w-full bg-[#83BD75] text-[#172015] font-bold hover:bg-[#74ad68] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Submitting Application...
          </>
        ) : (
          'Submit Application'
        )}
      </button>
    </form>
  );
}