'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getSettings, 
  updatePricingSettings, 
  updateSystemSettings 
} from '@/features/settings/api/settingsApi';
import AdminRoute from '@/app/components/admin/AdminRoute';

import { 
  MdSettings, 
  MdSave, 
  MdLocalShipping, 
  MdMap, 
  MdBuild, 
  MdInfo,
  MdAccessTime,
  MdCheckCircle,
  MdWarning
} from 'react-icons/md';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pricing');
  const [formData, setFormData] = useState({});

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  // Pricing mutation
  const pricingMutation = useMutation({
    mutationFn: updatePricingSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Pricing settings saved successfully!');
    },
    onError: (err) => alert('Failed to save: ' + (err.response?.data?.error || err.message)),
  });

  // System mutation
  const systemMutation = useMutation({
    mutationFn: updateSystemSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('System settings saved successfully!');
    },
    onError: (err) => alert('Failed to save: ' + (err.response?.data?.error || err.message)),
  });

  // Initialize form data when settings load
  useState(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handlePricingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: Number(value) }
    }));
  };

  const handleSystemChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      system: { ...prev.system, [field]: value }
    }));
  };

  const handleSavePricing = () => {
    pricingMutation.mutate(formData.pricing || {});
  };

  const handleSaveSystem = () => {
    systemMutation.mutate(formData.system || {});
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="flex min-h-screen items-center justify-center bg-[#f7fbf5]">
          <span className="loading loading-spinner loading-lg text-[#4d8d41]"></span>
        </div>
      </AdminRoute>
    );
  }

  if (error) {
    return (
      <AdminRoute>
        <div className="flex min-h-screen items-center justify-center bg-[#f7fbf5] p-8">
          <div className="text-center">
            <MdWarning className="mx-auto size-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold text-[#1f2a1d]">Error Loading Settings</h2>
            <p className="mt-2 text-red-600">{error.message}</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  const tabs = [
    { id: 'pricing', label: 'Delivery Pricing', icon: MdLocalShipping },
    { id: 'zones', label: 'Service Zones', icon: MdMap },
    { id: 'system', label: 'System & Maintenance', icon: MdBuild },
    { id: 'hours', label: 'Business Hours', icon: MdAccessTime },
    { id: 'about', label: 'App Information', icon: MdInfo },
  ];

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-[#f7fbf5]">
       
        <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1f2a1d] mb-2">Settings</h1>
            <p className="text-[#596257] mb-8">Manage system configuration and business rules</p>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Tabs */}
              <div className="lg:w-64 shrink-0">
                <div className="bg-white rounded-xl border border-[#dce8d8] p-2 shadow-sm">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#edf7ea] text-[#4d8d41]'
                          : 'text-[#596257] hover:bg-[#f7fbf5]'
                      }`}
                    >
                      <tab.icon className="size-5" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 bg-white rounded-xl border border-[#dce8d8] p-6 shadow-sm">
                
                {/* Pricing Tab */}
                {activeTab === 'pricing' && (
                  <div>
                    <h2 className="text-xl font-bold text-[#1f2a1d] mb-4 flex items-center gap-2">
                      <MdLocalShipping className="text-[#4d8d41]" /> Delivery Pricing Rules
                    </h2>
                    <p className="text-sm text-[#596257] mb-6">
                      These values are used to calculate delivery charges automatically.
                    </p>
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          Base Fare (৳)
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.baseFare || 50}
                          onChange={(e) => handlePricingChange('baseFare', e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          Per KM Rate (৳)
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.perKmRate || 30}
                          onChange={(e) => handlePricingChange('perKmRate', e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          Document Base Rate (৳)
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.documentBaseRate || 40}
                          onChange={(e) => handlePricingChange('documentBaseRate', e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          Outside City Multiplier (x)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.pricing?.outsideCityMultiplier || 1.5}
                          onChange={(e) => handlePricingChange('outsideCityMultiplier', e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          Minimum Charge (৳)
                        </label>
                        <input
                          type="number"
                          value={formData.pricing?.minimumCharge || 40}
                          onChange={(e) => handlePricingChange('minimumCharge', e.target.value)}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#e8f0e5] flex justify-end">
                      <button 
                        onClick={handleSavePricing}
                        disabled={pricingMutation.isPending}
                        className="btn bg-[#83BD75] text-[#172015] hover:bg-[#74ad68] disabled:opacity-50"
                      >
                        {pricingMutation.isPending ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <>
                            <MdSave className="size-4" /> Save Pricing
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* System Tab */}
                {activeTab === 'system' && (
                  <div>
                    <h2 className="text-xl font-bold text-[#1f2a1d] mb-4 flex items-center gap-2">
                      <MdBuild className="text-[#4d8d41]" /> System & Maintenance
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white border border-[#dce8d8] rounded-lg">
                        <div>
                          <p className="font-bold text-[#1f2a1d]">Maintenance Mode</p>
                          <p className="text-sm text-[#596257]">Disable all user access during maintenance.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={formData.system?.maintenanceMode || false}
                          onChange={(e) => handleSystemChange('maintenanceMode', e.target.checked)}
                          className="toggle toggle-error"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white border border-[#dce8d8] rounded-lg">
                        <div>
                          <p className="font-bold text-[#1f2a1d]">Allow New Registrations</p>
                          <p className="text-sm text-[#596257]">Enable or disable new user signups.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={formData.system?.allowNewRegistrations !== false}
                          onChange={(e) => handleSystemChange('allowNewRegistrations', e.target.checked)}
                          className="toggle toggle-success"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white border border-[#dce8d8] rounded-lg">
                        <div>
                          <p className="font-bold text-[#1f2a1d]">Allow New Parcel Bookings</p>
                          <p className="text-sm text-[#596257]">Enable or disable new parcel creation.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={formData.system?.allowNewParcelBookings !== false}
                          onChange={(e) => handleSystemChange('allowNewParcelBookings', e.target.checked)}
                          className="toggle toggle-success"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          Maintenance Message
                        </label>
                        <textarea
                          rows="3"
                          value={formData.system?.maintenanceMessage || ''}
                          onChange={(e) => handleSystemChange('maintenanceMessage', e.target.value)}
                          className="textarea textarea-bordered w-full"
                          placeholder="System is under maintenance. Please try again later."
                        />
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#e8f0e5] flex justify-end">
                      <button 
                        onClick={handleSaveSystem}
                        disabled={systemMutation.isPending}
                        className="btn bg-[#83BD75] text-[#172015] hover:bg-[#74ad68] disabled:opacity-50"
                      >
                        {systemMutation.isPending ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <>
                            <MdSave className="size-4" /> Save System Settings
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Zones Tab */}
                {activeTab === 'zones' && (
                  <div>
                    <h2 className="text-xl font-bold text-[#1f2a1d] mb-4 flex items-center gap-2">
                      <MdMap className="text-[#4d8d41]" /> Service Zones
                    </h2>
                    <p className="text-sm text-[#596257] mb-6">
                      Manage the regions and districts where SwiftShip operates.
                    </p>
                    <div className="p-8 text-center border-2 border-dashed border-[#dce8d8] rounded-lg">
                      <MdMap className="mx-auto size-12 text-slate-300 mb-2" />
                      <p className="text-[#596257]">Zone management interface coming soon.</p>
                      <p className="text-xs text-slate-400 mt-1">
                        For now, manage zones directly in MongoDB.
                      </p>
                    </div>
                  </div>
                )}

                {/* Business Hours Tab */}
                {activeTab === 'hours' && (
                  <div>
                    <h2 className="text-xl font-bold text-[#1f2a1d] mb-4 flex items-center gap-2">
                      <MdAccessTime className="text-[#4d8d41]" /> Business Hours
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white border border-[#dce8d8] rounded-lg">
                        <div>
                          <p className="font-bold text-[#1f2a1d]">24/7 Operation</p>
                          <p className="text-sm text-[#596257]">Service available round the clock.</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={formData.businessHours?.isOpen24_7 || true}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            businessHours: { ...prev.businessHours, isOpen24_7: e.target.checked }
                          }))}
                          className="toggle toggle-success"
                        />
                      </div>

                      {!formData.businessHours?.isOpen24_7 && (
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                              Opening Time
                            </label>
                            <input
                              type="time"
                              value={formData.businessHours?.openingTime || '08:00'}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                businessHours: { ...prev.businessHours, openingTime: e.target.value }
                              }))}
                              className="input input-bordered w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                              Closing Time
                            </label>
                            <input
                              type="time"
                              value={formData.businessHours?.closingTime || '22:00'}
                              onChange={(e) => setFormData(prev => ({
                                ...prev,
                                businessHours: { ...prev.businessHours, closingTime: e.target.value }
                              }))}
                              className="input input-bordered w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                  <div>
                    <h2 className="text-xl font-bold text-[#1f2a1d] mb-4 flex items-center gap-2">
                      <MdInfo className="text-[#4d8d41]" /> App Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          App Name
                        </label>
                        <input
                          type="text"
                          value={formData.appInfo?.appName || 'SwiftShip'}
                          readOnly
                          className="input input-bordered w-full bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={formData.appInfo?.supportEmail || 'support@swiftship.com'}
                          readOnly
                          className="input input-bordered w-full bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          Support Phone
                        </label>
                        <input
                          type="text"
                          value={formData.appInfo?.supportPhone || '+880 1XXX-XXXXXX'}
                          readOnly
                          className="input input-bordered w-full bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1f2a1d] mb-1">
                          Version
                        </label>
                        <input
                          type="text"
                          value={formData.appInfo?.version || '1.0.0'}
                          readOnly
                          className="input input-bordered w-full bg-slate-50"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}