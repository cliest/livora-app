import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Seo from '../../components/Seo.jsx';
import { TextField } from '../../components/ui/FormField.jsx';
import { siteSettingsSchema } from '../../lib/formSchemas.js';
import { api, ApiError } from '../../lib/api.js';

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [saveState, setSaveState] = useState(''); // '', 'saving', 'saved', 'error'
  const [saveError, setSaveError] = useState('');

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => (await api.getSettings()).settings,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(siteSettingsSchema) });

  // Populate the form once settings load (react-hook-form's defaultValues
  // can't be async, so reset() once the query resolves).
  useEffect(() => {
    if (settings) reset({ ...settings, facebookUrl: settings.facebookUrl || '', instagramUrl: settings.instagramUrl || '', tiktokUrl: settings.tiktokUrl || '' });
  }, [settings, reset]);

  const onSubmit = async (data) => {
    setSaveState('saving');
    setSaveError('');
    try {
      await api.updateSettings(data);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaveState('saved');
      setTimeout(() => setSaveState(''), 2000);
    } catch (err) {
      setSaveState('error');
      setSaveError(err instanceof ApiError ? err.message : 'Something went wrong.');
    }
  };

  if (!settings) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <Seo title="Site Settings | Livora Admin" description="Manage contact details." path="/admin/settings" noindex />
      <h1 className="text-[1.6rem] mb-s3">Site settings</h1>
      <p className="text-muted mb-s4 max-w-[560px]">
        These details appear across the whole public site — header, footer, contact page and every call-to-action.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white border border-line rounded-[18px] p-s4 max-w-[640px] grid grid-cols-2 gap-x-s3 gap-y-s3">
        <TextField label="Phone (display)" name="phoneDisplay" register={register} error={errors.phoneDisplay} required placeholder="+260 76 073 7805" />
        <TextField label="Phone (tel: / WhatsApp)" name="phoneDial" register={register} error={errors.phoneDial} required placeholder="+260760737805" />
        <TextField label="Email" name="email" register={register} error={errors.email} required type="email" full />
        <TextField label="Address line 1" name="addressLine1" register={register} error={errors.addressLine1} required />
        <TextField label="Address line 2" name="addressLine2" register={register} error={errors.addressLine2} required />
        <TextField label="Facebook URL" name="facebookUrl" register={register} error={errors.facebookUrl} placeholder="https://facebook.com/…" />
        <TextField label="Instagram URL" name="instagramUrl" register={register} error={errors.instagramUrl} placeholder="https://instagram.com/…" />
        <TextField label="TikTok URL" name="tiktokUrl" register={register} error={errors.tiktokUrl} placeholder="https://tiktok.com/@…" full />

        {saveState === 'error' && (
          <div className="col-span-2 bg-[#FFF6F5] border border-coral-600/30 text-coral-600 text-[0.9rem] font-semibold rounded-xl px-4 py-3">
            {saveError}
          </div>
        )}

        <div className="col-span-2 flex items-center gap-s2">
          <button type="submit" disabled={saveState === 'saving'} className="btn btn--primary disabled:opacity-60">
            {saveState === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
          {saveState === 'saved' && <span className="text-[0.85rem] font-semibold text-[#15803D]">Saved</span>}
        </div>
      </form>
    </div>
  );
}
