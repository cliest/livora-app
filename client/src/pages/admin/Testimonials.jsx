import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Seo from '../../components/Seo.jsx';
import { TextField, TextAreaField } from '../../components/ui/FormField.jsx';
import { testimonialSchema } from '../../lib/formSchemas.js';
import { api, ApiError } from '../../lib/api.js';

const EMPTY = { quote: '', name: '', role: '', published: true };

export default function AdminTestimonials() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => (await api.adminListTestimonials()).items,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(testimonialSchema), defaultValues: EMPTY });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  const createMutation = useMutation({ mutationFn: api.createTestimonial, onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, payload }) => api.updateTestimonial(id, payload), onSuccess: invalidate });
  const deleteMutation = useMutation({ mutationFn: api.deleteTestimonial, onSuccess: invalidate });

  const startEdit = (t) => {
    setEditingId(t.id);
    reset({ quote: t.quote, name: t.name, role: t.role, published: t.published });
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

  const handleDelete = (id) => {
    if (confirm('Remove this testimonial from the site?')) deleteMutation.mutate(id);
  };

  return (
    <div>
      <Seo title="Testimonials | Livora Admin" description="Manage homepage testimonials." path="/admin/testimonials" noindex />
      <h1 className="text-[1.6rem] mb-s4">Testimonials</h1>

      <div className="flex flex-wrap gap-s4">
        <div className="flex-1 min-w-[320px]">
          <div className="bg-white border border-line rounded-[18px] p-s4">
            <h2 className="text-[1.1rem] mb-s3">{editingId ? 'Edit testimonial' : 'Add a testimonial'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-s3">
              <TextAreaField label="Quote" name="quote" register={register} error={errors.quote} required />
              <TextField label="Patient name" name="name" register={register} error={errors.name} required placeholder="e.g. Mwape C." />
              <TextField label="Role / treatment" name="role" register={register} error={errors.role} required placeholder="e.g. Emergency root canal" />

              <label className="flex items-center gap-2 text-[0.88rem] font-medium text-ink">
                <input type="checkbox" {...register('published')} className="w-[18px] h-[18px] accent-cyan" />
                Published (visible on the homepage)
              </label>

              {formError && (
                <div className="bg-coral-wash border border-coral-600/30 text-coral-600 text-[0.9rem] font-semibold rounded-xl px-4 py-3">
                  {formError}
                </div>
              )}

              <div className="flex gap-s2">
                <button type="submit" disabled={isSubmitting} className="btn btn--primary disabled:opacity-60">
                  {editingId ? 'Save changes' : 'Add testimonial'}
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
            {!isLoading && items.length === 0 && <p className="text-muted">No testimonials yet.</p>}
            {items.map((t) => (
              <div key={t.id} className="bg-white border border-line rounded-[18px] p-s3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">
                      {t.name}
                      {!t.published && <span className="ml-2 text-[0.72rem] font-semibold text-coral-600 uppercase">Unpublished</span>}
                    </p>
                    <p className="text-[0.85rem] text-muted">{t.role}</p>
                  </div>
                  <div className="flex gap-2 flex-none">
                    <button type="button" onClick={() => startEdit(t)} className="btn btn--outline btn--sm">
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(t.id)} className="btn btn--outline btn--sm text-coral-600">
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-[0.86rem] text-muted mt-2 line-clamp-2">{t.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
