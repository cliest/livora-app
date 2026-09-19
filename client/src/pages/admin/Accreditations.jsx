import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Seo from '../../components/Seo.jsx';
import { TextField } from '../../components/ui/FormField.jsx';
import { accreditationSchema } from '../../lib/formSchemas.js';
import { api, ApiError } from '../../lib/api.js';

const EMPTY = { title: '', badgeUrl: '', published: true };

export default function AdminAccreditations() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-accreditations'],
    queryFn: async () => (await api.adminListAccreditations()).items,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(accreditationSchema), defaultValues: EMPTY });

  const badgeUrl = watch('badgeUrl');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-accreditations'] });
    queryClient.invalidateQueries({ queryKey: ['accreditations'] }); // public About page feed
  };

  const createMutation = useMutation({ mutationFn: api.createAccreditation, onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, payload }) => api.updateAccreditation(id, payload), onSuccess: invalidate });
  const deleteMutation = useMutation({ mutationFn: api.deleteAccreditation, onSuccess: invalidate });

  const startEdit = (item) => {
    setEditingId(item.id);
    reset({ title: item.title, badgeUrl: item.badgeUrl || '', published: item.published });
  };
  const startAdd = () => {
    setEditingId(null);
    reset(EMPTY);
  };

  const onSubmit = async (data) => {
    setFormError('');
    try {
      if (editingId) await updateMutation.mutateAsync({ id: editingId, payload: data });
      else await createMutation.mutateAsync(data);
      startAdd();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Something went wrong.');
    }
  };

  const handleBadgeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError('');
    try {
      const res = await api.uploadImage(file);
      setValue('badgeUrl', res.url);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Remove this accreditation from the About page?')) deleteMutation.mutate(id);
  };

  return (
    <div>
      <Seo title="Accreditations | Livora Admin" description="Manage the About page's accreditation badges." path="/admin/accreditations" noindex />
      <h1 className="text-[1.6rem] mb-4">Accreditations</h1>
      <p className="text-muted mb-s4 max-w-[560px]">
        These show in the &ldquo;Registered, inspected, accountable&rdquo; section of the About page.
      </p>

      <div className="flex flex-wrap gap-s4">
        <div className="flex-1 min-w-[320px]">
          <div className="bg-white border border-line rounded-[18px] p-s4">
            <h2 className="text-[1.1rem] mb-s3">{editingId ? 'Edit accreditation' : 'Add an accreditation'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-s3">
              <div>
                <label className="block text-[0.85rem] font-bold text-ink mb-[7px]">Badge / certificate image (optional)</label>
                <div className="flex items-center gap-3">
                  {badgeUrl && (
                    <img src={badgeUrl} alt="" className="w-[58px] h-[58px] rounded-xl object-contain bg-sand border border-line p-1" />
                  )}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleBadgeChange} disabled={uploading} className="text-[0.85rem]" />
                </div>
                {uploading && <p className="text-[0.8rem] text-muted mt-1">Uploading…</p>}
              </div>

              <TextField label="Title" name="title" register={register} error={errors.title} required placeholder="e.g. NHIMA Accredited Provider" />

              <label className="flex items-center gap-2 text-[0.88rem] font-medium text-ink">
                <input type="checkbox" {...register('published')} className="w-[18px] h-[18px] accent-cyan" />
                Published (visible on the About page)
              </label>

              {formError && (
                <div className="bg-coral-wash border border-coral-600/30 text-coral-600 text-[0.9rem] font-semibold rounded-xl px-4 py-3">
                  {formError}
                </div>
              )}

              <div className="flex gap-s2">
                <button type="submit" disabled={isSubmitting || uploading} className="btn btn--primary disabled:opacity-60">
                  {editingId ? 'Save changes' : 'Add accreditation'}
                </button>
                {editingId && (
                  <button type="button" onClick={startAdd} className="btn btn--outline">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="flex-[1.3] min-w-[320px]">
          <div className="flex flex-col gap-s2">
            {isLoading && <p className="text-muted">Loading…</p>}
            {!isLoading && items.length === 0 && <p className="text-muted">No accreditations yet.</p>}
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-line rounded-[18px] p-s3 flex items-center gap-3">
                <div className="w-[50px] h-[50px] rounded-xl overflow-hidden bg-sand flex-none flex items-center justify-center">
                  {item.badgeUrl && <img src={item.badgeUrl} alt="" className="w-full h-full object-contain p-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink truncate">
                    {item.title}
                    {!item.published && <span className="ml-2 text-[0.72rem] font-semibold text-coral-600 uppercase">Unpublished</span>}
                  </p>
                </div>
                <div className="flex gap-2 flex-none">
                  <button type="button" onClick={() => startEdit(item)} className="btn btn--outline btn--sm">
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="btn btn--outline btn--sm text-coral-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
