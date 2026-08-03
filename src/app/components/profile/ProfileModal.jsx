'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/features/users/api/userApi';
import axiosSecure from '../../utils/axiosSecure'
import { MdClose, MdPerson, MdPhone, MdLocationOn, MdImage, MdSave, MdCloudUpload } from 'react-icons/md';

export default function ProfileModal({ user, isOpen, onClose }) {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    photoURL: user?.photoURL || '',
  });

  const [previewImage, setPreviewImage] = useState(user?.photoURL || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      onClose();
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image is too large. Please choose an image under 2MB.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 const uploadToCloudinary = async (file) => {
  const formDataUpload = new FormData();
  formDataUpload.append('image', file);

  try {
    
    
    const response = await axiosSecure.post(
      '/api/upload/profile-picture', 
      formDataUpload
    );
    
    
    return response.data.url;
  } catch (error) {
    
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw error;
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  let finalPhotoURL = formData.photoURL;

  // Only upload if a new file was selected
  if (selectedFile) {
    try {
      setIsUploading(true);
      console.log('Uploading new image...');
      finalPhotoURL = await uploadToCloudinary(selectedFile);
    } catch (error) {
      
      alert('Failed to upload profile picture. Please try again.');
      setIsUploading(false);
      return; 
    } finally {
      setIsUploading(false);
    }
  }

  // Only save if we have a valid Cloudinary URL (not base64)
  if (finalPhotoURL && finalPhotoURL.startsWith('data:')) {
    console.error('️ Attempting to save base64 - this should not happen!');
    finalPhotoURL = ''; // Clear it instead of saving base64
  }

  console.log('Saving profile with photoURL:', finalPhotoURL);
  mutation.mutate({
    ...formData,
    photoURL: finalPhotoURL,
  });
};
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-xl font-bold text-[#1f2a1d]">Edit Profile</h2>
          <button onClick={onClose} className="rounded-full p-1 transition hover:bg-slate-100" aria-label="Close modal">
            <MdClose className="size-6 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative size-24 overflow-hidden rounded-full border-2 border-[#83BD75] bg-slate-100">
              {previewImage && !previewImage.startsWith('data:') ? (
                <img src={previewImage} alt="Profile Preview" className="size-full object-cover" />
              ) : previewImage && previewImage.startsWith('data:') ? (
                <div className="size-full flex items-center justify-center bg-slate-200">
                  <MdPerson className="size-10 text-slate-400" />
                </div>
              ) : (
                <MdPerson className="size-full p-4 text-slate-400" />
              )}
            </div>
            <label className="cursor-pointer rounded-lg bg-[#edf7ea] px-4 py-2 text-sm font-semibold text-[#4d8d41] transition hover:bg-[#d9ebd4] flex items-center gap-2">
              <MdCloudUpload className="size-4" />
              {previewImage ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-[#4d8d41]">
                <span className="loading loading-spinner loading-sm"></span>
                Uploading to Cloudinary...
              </div>
            )}
            <p className="text-xs text-slate-400">Max size: 2MB • JPG, PNG, GIF</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:border-[#83BD75] focus:outline-none focus:ring-1 focus:ring-[#83BD75]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Phone Number</label>
            <div className="relative">
              <MdPhone className="absolute left-3 top-3 size-5 text-slate-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className="w-full rounded-lg border border-slate-200 px-10 py-2.5 focus:border-[#83BD75] focus:outline-none focus:ring-1 focus:ring-[#83BD75]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Address</label>
            <div className="relative">
              <MdLocationOn className="absolute left-3 top-3 size-5 text-slate-400" />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your full delivery address"
                rows="3"
                className="w-full rounded-lg border border-slate-200 px-10 py-2.5 focus:border-[#83BD75] focus:outline-none focus:ring-1 focus:ring-[#83BD75]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || isUploading}
              className="flex items-center gap-2 rounded-lg bg-[#83BD75] px-5 py-2.5 text-sm font-bold text-[#172015] transition hover:bg-[#74ad68] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending || isUploading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span> Saving...
                </>
              ) : (
                <>
                  <MdSave className="size-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}