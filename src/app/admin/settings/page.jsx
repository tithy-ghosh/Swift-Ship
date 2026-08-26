'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSettings,
  updatePricingSettings,
  updateSystemSettings,
  createZone,
  updateZone,
  deleteZone,
} from '@/features/settings/api/settingsApi';
import AdminRoute from '@/app/components/admin/AdminRoute';
import ZoneFormModal from '@/app/components/settings/ZoneFormModal';
import ConfirmModal from '@/app/components/common/ConfirmModal';
import Toast from '@/app/components/common/Toast';
import districtData from '@/app/data/bangladesh-districts.json';

import {
  MdSave,
  MdLocalShipping,
  MdMap,
  MdBuild,
  MdInfo,
  MdAccessTime,
  MdWarning,
  MdAdd,
  MdEdit,
  MdDeleteOutline,
  MdToggleOn,
  MdToggleOff,
  MdClose,
} from 'react-icons/md';

const DISTRICT_OPTIONS = districtData.map((d) => d.name).sort();

const PRICING_FIELDS = [
  {
    key: 'documentWithinCityRate',
    label: 'Document — Within City (৳)',
    hint: 'Flat rate for a document parcel sent inside the same service center.',
  },
  {
    key: 'documentOutsideCityRate',
    label: 'Document — Outside City (৳)',
    hint: 'Flat rate for a document parcel crossing service centers.',
  },
  {
    key: 'nonDocumentBaseWithinCityRate',
    label: 'Parcel Base — Within City (৳)',
    hint: 'Base charge for a non-document parcel up to the max base weight.',
  },
  {
    key: 'nonDocumentBaseOutsideCityRate',
    label: 'Parcel Base — Outside City (৳)',
    hint: 'Base charge for a non-document parcel crossing service centers.',
  },
  {
    key: 'maxBaseWeightKg',
    label: 'Max Base Weight (kg)',
    hint: 'Weight included in the base charge before extra-weight fees apply.',
    step: '0.1',
  },
  {
    key: 'extraWeightRatePerKg',
    label: 'Extra Weight Rate (৳ / kg)',
    hint: 'Charged per kg above the max base weight, rounded up.',
  },
  {
    key: 'outsideCityExtraCharge',
    label: 'Outside City Surcharge (৳)',
    hint: 'Added on top of overweight parcels crossing service centers.',
  },
  {
    key: 'minimumCharge',
    label: 'Minimum Charge (৳)',
    hint: 'Floor price — no parcel is ever quoted below this.',
  },
];

const TABS = [
  { id: 'pricing', label: 'Delivery Pricing', icon: MdLocalShipping },
  { id: 'zones', label: 'Service Zones', icon: MdMap },
  { id: 'system', label: 'System & Maintenance', icon: MdBuild },
  { id: 'hours', label: 'Business Hours', icon: MdAccessTime },
  { id: 'about', label: 'App Information', icon: MdInfo },
];

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pricing');
  const [formData, setFormData] = useState({});
  const [toast, setToast] = useState(null);
  const [zoneModal, setZoneModal] = useState(null); // { mode: 'create'|'edit', zone? }
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const [editingPricing, setEditingPricing] = useState(false);
  const [editingSystem, setEditingSystem] = useState(false);

  const showToast = (type, message) => setToast({ type, message });

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  // Sync fetched settings into local form state. This was previously a
  // `useState(() => {...}, [settings])` call — useState ignores dependency
  // arrays entirely, so the form never picked up loaded data. useEffect is
  // the correct tool here.
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const invalidateSettings = () => queryClient.invalidateQueries({ queryKey: ['settings'] });

  const pricingMutation = useMutation({
    mutationFn: updatePricingSettings,
    onSuccess: () => {
      invalidateSettings();
      setEditingPricing(false);
      showToast('success', 'Pricing settings saved — new quotes will use these rates immediately.');
    },
    onError: (err) => showToast('error', err.response?.data?.error || 'Failed to save pricing settings.'),
  });

  const systemMutation = useMutation({
    mutationFn: updateSystemSettings,
    onSuccess: () => {
      invalidateSettings();
      setEditingSystem(false);
      showToast('success', 'System settings saved.');
    },
    onError: (err) => showToast('error', err.response?.data?.error || 'Failed to save system settings.'),
  });

  const createZoneMutation = useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      invalidateSettings();
      setZoneModal(null);
      showToast('success', 'Zone created.');
    },
    onError: (err) => showToast('error', err.response?.data?.error || 'Failed to create zone.'),
  });

  const updateZoneMutation = useMutation({
    mutationFn: updateZone,
    onSuccess: () => {
      invalidateSettings();
      setZoneModal(null);
      showToast('success', 'Zone updated.');
    },
    onError: (err) => showToast('error', err.response?.data?.error || 'Failed to update zone.'),
  });

  const deleteZoneMutation = useMutation({
    mutationFn: deleteZone,
    onSuccess: () => {
      invalidateSettings();
      setZoneToDelete(null);
      showToast('success', 'Zone deleted.');
    },
    onError: (err) => showToast('error', err.response?.data?.error || 'Failed to delete zone.'),
  });

  const handlePricingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [field]: Number(value) },
    }));
  };

  const handleSystemChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      system: { ...prev.system, [field]: value },
    }));
  };

  const handleSavePricing = () => pricingMutation.mutate(formData.pricing || {});
  const handleSaveSystem = () => systemMutation.mutate(formData.system || {});

  const handleCancelPricing = () => {
    setFormData((prev) => ({ ...prev, pricing: settings?.pricing }));
    setEditingPricing(false);
  };

  const handleCancelSystem = () => {
    setFormData((prev) => ({ ...prev, system: settings?.system }));
    setEditingSystem(false);
  };

  const handleZoneSubmit = (payload) => {
    if (zoneModal.mode === 'edit') {
      updateZoneMutation.mutate({ zoneId: zoneModal.zone._id, ...payload });
    } else {
      createZoneMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="flex min-h-[60vh] items-center justify-center">
          <span className="loading loading-spinner loading-lg text-[#4d8d41]" />
        </div>
      </AdminRoute>
    );
  }

  if (error) {
    return (
      <AdminRoute>
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <div className="text-center">
            <MdWarning className="mx-auto size-16 text-red-500" />
            <h2 className="mt-4 text-2xl font-bold text-[#1f2a1d]">Error Loading Settings</h2>
            <p className="mt-2 text-red-600">{error.message}</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      {toast && <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto">
        {/* Header, matching the pill style used on the rider admin pages */}
        <div className="flex items-center gap-3 justify-center mx-auto bg-[#d9efbd] px-6 py-0.5 rounded-full w-fit mb-2">
          <p className="text-sm font-bold text-[#1D2128] tracking-[0.2em]">Settings</p>
        </div>
        <p className="text-xl text-[#596257] mb-8 mx-auto flex items-center justify-center text-center tracking-wider font-sans">
          Manage system configuration and business rules.
        </p>

        {/* Horizontal Tabs */}
        <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#4d8d41] text-white shadow-sm'
                      : 'bg-white text-[#596257] border border-[#dce8d8] hover:border-[#83BD75] hover:text-[#1f2a1d]'
                  }`}
                >
                  <tab.icon className={`size-[18px] ${isActive ? 'text-white' : 'text-[#4d8d41]'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-[#dce8d8] p-6 shadow-sm">
          {activeTab === 'pricing' && (
            <PricingTab
              formData={formData}
              onChange={handlePricingChange}
              onSave={handleSavePricing}
              onCancel={handleCancelPricing}
              isPending={pricingMutation.isPending}
              isEditing={editingPricing}
              onEdit={() => setEditingPricing(true)}
            />
          )}

          {activeTab === 'zones' && (
            <ZonesTab
              zones={formData.serviceZones || []}
              onAdd={() => setZoneModal({ mode: 'create' })}
              onEdit={(zone) => setZoneModal({ mode: 'edit', zone })}
              onDelete={(zone) => setZoneToDelete(zone)}
              onToggleActive={(zone) =>
                updateZoneMutation.mutate({ zoneId: zone._id, isActive: !zone.isActive })
              }
              togglingZoneId={updateZoneMutation.isPending ? updateZoneMutation.variables?.zoneId : null}
            />
          )}

          {activeTab === 'system' && (
            <SystemTab
              formData={formData}
              onChange={handleSystemChange}
              onSave={handleSaveSystem}
              onCancel={handleCancelSystem}
              isPending={systemMutation.isPending}
              isEditing={editingSystem}
              onEdit={() => setEditingSystem(true)}
            />
          )}

          {activeTab === 'hours' && <HoursTab formData={formData} setFormData={setFormData} />}

          {activeTab === 'about' && <AboutTab formData={formData} />}
        </div>
      </div>

      {zoneModal && (
        <ZoneFormModal
          mode={zoneModal.mode}
          initialData={zoneModal.zone}
          districtOptions={DISTRICT_OPTIONS}
          onClose={() => setZoneModal(null)}
          onSubmit={handleZoneSubmit}
          isPending={createZoneMutation.isPending || updateZoneMutation.isPending}
        />
      )}

      {zoneToDelete && (
        <ConfirmModal
          title="Delete Zone"
          message={
            <>
              Are you sure you want to delete <strong className="text-[#1f2a1d]">{zoneToDelete.name}</strong>? This
              cannot be undone.
            </>
          }
          confirmLabel="Delete Zone"
          tone="danger"
          onClose={() => setZoneToDelete(null)}
          onConfirm={() => deleteZoneMutation.mutate(zoneToDelete._id)}
          isPending={deleteZoneMutation.isPending}
        />
      )}
    </AdminRoute>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-[#1f2a1d] flex items-center gap-2">
          <Icon className="text-[#4d8d41]" /> {title}
        </h2>
        {subtitle && <p className="text-sm text-[#596257] mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function EditButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="btn btn-sm bg-white border border-[#dce8d8] text-[#1f2a1d] hover:border-[#83BD75] hover:bg-[#f7fbf5] shadow-sm"
    >
      <MdEdit className="size-4" /> Edit
    </button>
  );
}

function EditActions({ onSave, onCancel, isPending, saveLabel = 'Save Changes' }) {
  return (
    <div className="mt-8 pt-6 border-t border-[#e8f0e5] flex justify-end gap-3">
      <button onClick={onCancel} disabled={isPending} className="btn btn-ghost">
        <MdClose className="size-4" /> Cancel
      </button>
      <button
        onClick={onSave}
        disabled={isPending}
        className="btn bg-[#83BD75] text-[#172015] hover:bg-[#74ad68] disabled:opacity-50 shadow-sm"
      >
        {isPending ? <span className="loading loading-spinner loading-sm" /> : (
          <>
            <MdSave className="size-4" /> {saveLabel}
          </>
        )}
      </button>
    </div>
  );
}

function PricingTab({ formData, onChange, onSave, onCancel, isPending, isEditing, onEdit }) {
  if (!isEditing) {
    return (
      <div>
        <SectionHeader
          icon={MdLocalShipping}
          title="Delivery Pricing Rules"
          subtitle="These are the live values the pricing engine uses to price every quote and parcel."
          action={<EditButton onClick={onEdit} />}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {PRICING_FIELDS.map(({ key, label, hint }) => (
            <div key={key} className="rounded-xl border border-[#e8f0e5] bg-[#f7fbf5] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a978a]">{label}</p>
              <p className="text-2xl font-bold text-[#1f2a1d] mt-1">{formData.pricing?.[key] ?? '—'}</p>
              <p className="text-xs text-[#8a978a] mt-1">{hint}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        icon={MdLocalShipping}
        title="Delivery Pricing Rules"
        subtitle="Changes apply to new quotes and parcels immediately after saving."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {PRICING_FIELDS.map(({ key, label, hint, step }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-[#1f2a1d] mb-1">{label}</label>
            <input
              type="number"
              step={step || '1'}
              value={formData.pricing?.[key] ?? ''}
              onChange={(e) => onChange(key, e.target.value)}
              className="input input-bordered w-full focus:border-[#83BD75] focus:outline-none"
            />
            <p className="text-xs text-[#8a978a] mt-1">{hint}</p>
          </div>
        ))}
      </div>

      <EditActions onSave={onSave} onCancel={onCancel} isPending={isPending} saveLabel="Save Pricing" />
    </div>
  );
}

function ZonesTab({ zones, onAdd, onEdit, onDelete, onToggleActive, togglingZoneId }) {
  return (
    <div>
      <SectionHeader
        icon={MdMap}
        title="Service Zones"
        subtitle="Group districts into named zones for reporting and coverage management."
        action={
          <button
            onClick={onAdd}
            className="btn btn-sm bg-[#83BD75] text-[#172015] hover:bg-[#74ad68] shadow-sm"
          >
            <MdAdd className="size-4" /> Add Zone
          </button>
        }
      />

      {zones.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-[#dce8d8] rounded-xl">
          <MdMap className="mx-auto size-12 text-slate-300 mb-2" />
          <p className="text-[#596257]">No service zones yet.</p>
          <p className="text-xs text-slate-400 mt-1">Create your first zone to start grouping districts.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {zones.map((zone) => (
            <div
              key={zone._id}
              className="rounded-2xl border border-[#dce8d8] p-4 hover:border-[#c3ddba] hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-[#1f2a1d] truncate">{zone.name}</h3>
                  <span
                    className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      zone.isActive ? 'bg-[#edf7ea] text-[#4d8d41]' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {zone.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onToggleActive(zone)}
                    disabled={togglingZoneId === zone._id}
                    className="btn btn-ghost btn-xs btn-circle disabled:opacity-40"
                    title={zone.isActive ? 'Deactivate zone' : 'Activate zone'}
                  >
                    {zone.isActive ? (
                      <MdToggleOn className="size-5 text-[#4d8d41]" />
                    ) : (
                      <MdToggleOff className="size-5 text-slate-300" />
                    )}
                  </button>
                  <button
                    onClick={() => onEdit(zone)}
                    className="btn btn-ghost btn-xs btn-circle"
                    title="Edit zone"
                  >
                    <MdEdit className="size-4 text-[#596257]" />
                  </button>
                  <button
                    onClick={() => onDelete(zone)}
                    className="btn btn-ghost btn-xs btn-circle"
                    title="Delete zone"
                  >
                    <MdDeleteOutline className="size-4 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {zone.districts?.length ? (
                  <>
                    {zone.districts.slice(0, 5).map((district) => (
                      <span
                        key={district}
                        className="px-2 py-0.5 rounded-full bg-[#f7fbf5] border border-[#e8f0e5] text-xs text-[#596257]"
                      >
                        {district}
                      </span>
                    ))}
                    {zone.districts.length > 5 && (
                      <span className="px-2 py-0.5 rounded-full bg-[#f7fbf5] border border-[#e8f0e5] text-xs text-[#596257]">
                        +{zone.districts.length - 5} more
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xs text-slate-400">No districts assigned.</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SYSTEM_TOGGLES = [
  {
    key: 'maintenanceMode',
    title: 'Maintenance Mode',
    description: 'Disable all user access during maintenance.',
    toggleClass: 'toggle-error',
    getChecked: (system) => system?.maintenanceMode || false,
  },
  {
    key: 'allowNewRegistrations',
    title: 'Allow New Registrations',
    description: 'Enable or disable new user signups.',
    toggleClass: 'toggle-success',
    getChecked: (system) => system?.allowNewRegistrations !== false,
  },
  {
    key: 'allowNewParcelBookings',
    title: 'Allow New Parcel Bookings',
    description: 'Enable or disable new parcel creation.',
    toggleClass: 'toggle-success',
    getChecked: (system) => system?.allowNewParcelBookings !== false,
  },
];

function SystemTab({ formData, onChange, onSave, onCancel, isPending, isEditing, onEdit }) {
  if (!isEditing) {
    return (
      <div>
        <SectionHeader icon={MdBuild} title="System & Maintenance" action={<EditButton onClick={onEdit} />} />

        <div className="space-y-3">
          {SYSTEM_TOGGLES.map(({ key, title, description, getChecked }) => {
            const checked = getChecked(formData.system);
            return (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-[#f7fbf5] border border-[#e8f0e5] rounded-xl"
              >
                <div>
                  <p className="font-bold text-[#1f2a1d]">{title}</p>
                  <p className="text-sm text-[#596257]">{description}</p>
                </div>
                <span
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                    checked ? 'bg-[#edf7ea] text-[#4d8d41]' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {checked ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            );
          })}

          <div className="p-4 bg-[#f7fbf5] border border-[#e8f0e5] rounded-xl">
            <p className="font-bold text-[#1f2a1d] mb-1">Maintenance Message</p>
            <p className="text-sm text-[#596257] italic">
              {formData.system?.maintenanceMessage || 'System is under maintenance. Please try again later.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader icon={MdBuild} title="System & Maintenance" />

      <div className="space-y-4">
        {SYSTEM_TOGGLES.map(({ key, title, description, toggleClass, getChecked }) => (
          <ToggleRow
            key={key}
            title={title}
            description={description}
            checked={getChecked(formData.system)}
            onChange={(checked) => onChange(key, checked)}
            toggleClass={toggleClass}
          />
        ))}

        <div>
          <label className="block text-sm font-medium text-[#1f2a1d] mb-1">Maintenance Message</label>
          <textarea
            rows="3"
            value={formData.system?.maintenanceMessage || ''}
            onChange={(e) => onChange('maintenanceMessage', e.target.value)}
            className="textarea textarea-bordered w-full focus:border-[#83BD75] focus:outline-none"
            placeholder="System is under maintenance. Please try again later."
          />
        </div>
      </div>

      <EditActions onSave={onSave} onCancel={onCancel} isPending={isPending} saveLabel="Save System Settings" />
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange, toggleClass }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#f7fbf5] border border-[#e8f0e5] rounded-xl">
      <div>
        <p className="font-bold text-[#1f2a1d]">{title}</p>
        <p className="text-sm text-[#596257]">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`toggle ${toggleClass}`}
      />
    </div>
  );
}

function HoursTab({ formData, setFormData }) {
  const isOpen247 = formData.businessHours?.isOpen24_7 ?? true;

  const updateHours = (field, value) =>
    setFormData((prev) => ({
      ...prev,
      businessHours: { ...prev.businessHours, [field]: value },
    }));

  return (
    <div>
      <SectionHeader icon={MdAccessTime} title="Business Hours" />

      <div className="space-y-4">
        <ToggleRow
          title="24/7 Operation"
          description="Service available round the clock."
          checked={isOpen247}
          onChange={(checked) => updateHours('isOpen24_7', checked)}
          toggleClass="toggle-success"
        />

        {!isOpen247 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[#1f2a1d] mb-1">Opening Time</label>
              <input
                type="time"
                value={formData.businessHours?.openingTime || '08:00'}
                onChange={(e) => updateHours('openingTime', e.target.value)}
                className="input input-bordered w-full focus:border-[#83BD75] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1f2a1d] mb-1">Closing Time</label>
              <input
                type="time"
                value={formData.businessHours?.closingTime || '22:00'}
                onChange={(e) => updateHours('closingTime', e.target.value)}
                className="input input-bordered w-full focus:border-[#83BD75] focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-[#8a978a] mt-4">
        Business hours are informational only for now — hook this into booking validation when you're ready to enforce it.
      </p>
    </div>
  );
}

function AboutTab({ formData }) {
  return (
    <div>
      <SectionHeader icon={MdInfo} title="App Information" />
      <div className="space-y-4">
        {[
          { label: 'App Name', value: formData.appInfo?.appName || 'SwiftShip' },
          { label: 'Support Email', value: formData.appInfo?.supportEmail || 'support@swiftship.com' },
          { label: 'Support Phone', value: formData.appInfo?.supportPhone || '+880 1XXX-XXXXXX' },
          { label: 'Version', value: formData.appInfo?.version || '1.0.0' },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-[#1f2a1d] mb-1">{field.label}</label>
            <input type="text" value={field.value} readOnly className="input input-bordered w-full bg-[#f7fbf5]" />
          </div>
        ))}
      </div>
    </div>
  );
}