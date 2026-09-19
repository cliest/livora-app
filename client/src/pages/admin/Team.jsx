import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Seo from '../../components/Seo.jsx';
import { TextField, TextAreaField } from '../../components/ui/FormField.jsx';
import { teamMemberSchema } from '../../lib/formSchemas.js';
import { api, ApiError } from '../../lib/api.js';

const EMPTY = { name: '', role: '', bio: '', credentials: '', photoUrl: '', published: true };

export default function AdminTeam() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null); // null = "add new"
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');

  const { data: team = [], isLoading } = useQuery({ queryKey: ['admin-team'], queryFn: async () => (await api.adminListTeam()).items });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(teamMemberSchema), defaultValues: EMPTY });

  const photoUrl = watch('photoUrl');

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-team'] });
    queryClient.invalidateQueries({ queryKey: ['team'] }); // public About page feed
  };

  const createMutation = useMutation({ mutationFn: api.createTeamMember, onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, payload }) => api.updateTeamMember(id, payload), onSuccess: invalidate });
  const deleteMutation = useMutation({ mutationFn: api.deleteTeamMember, onSuccess: invalidate });

  const startEdit = (member) => {
    setEditingId(member.id);
    reset({ name: member.name, role: member.role, bio: member.bio, credentials: member.credentials, photoUrl: member.photoUrl || '', published: member.published });
  };

  const startAdd = () => {
    setEditingId(null);
    reset(EMPTY);
  };

  const onSubmit = async (data) => {
    setFormError('');
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload: data });
      } else {
        await createMutation.mutateAsync(data);
      }
      startAdd();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Something went wrong.');
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError('');
    try {
      const res = await api.uploadImage(file);
      setValue('photoUrl', res.url);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Remove this team member from the site?')) deleteMutation.mutate(id);
  };

  return (
    <div>
      <Seo title="Team | Livora Admin" description="Manage the team page." path="/admin/team" noindex />
      <h1 className="text-[1.6rem] mb-s4">Team members</h1>

      <div className="flex flex-wrap gap-s4">
        {/* Form */}
        <div className="flex-1 min-w-[320px]">
          <div className="bg-white border border-line rounded-[18px] p-s4">
            <h2 className="text-[1.1rem] mb-s3">{editingId ? 'Edit member' : 'Add a member'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-s3">
              <div>
                <label className="block text-[0.85rem] font-bold text-ink mb-[7px]">Photo</label>
                <div className="flex items-center gap-3">
                  {photoUrl && (
                    <img src={photoUrl} alt="" className="w-[58px] h-[58px] rounded-xl object-cover border border-line" />
                  )}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} disabled={uploading} className="text-[0.85rem]" />
                </div>
                {uploading && <p className="text-[0.8rem] text-muted mt-1">Uploading…</p>}
              </div>

              <TextField label="Name" name="name" register={register} error={errors.name} required />
              <TextField label="Role" name="role" register={register} error={errors.role} required />
              <TextAreaField label="Bio" name="bio" register={register} error={errors.bio} required />
              <TextField label="Credentials" name="credentials" register={register} error={errors.credentials} required placeholder="BDS · MSc … · Languages" />

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
                  {editingId ? 'Save changes' : 'Add member'}
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

        {/* List */}
        <div className="flex-[1.3] min-w-[320px]">
          <div className="flex flex-col gap-s2">
            {isLoading && <p className="text-muted">Loading…</p>}
            {!isLoading && team.length === 0 && <p className="text-muted">No team members yet.</p>}
            {team.map((t) => (
              <div key={t.id} className="bg-white border border-line rounded-[18px] p-s3 flex items-center gap-3">
                <div className="w-[50px] h-[50px] rounded-xl overflow-hidden bg-sand flex-none">
                  {t.photoUrl && <img src={t.photoUrl} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink truncate">
                    {t.name}
                    {!t.published && <span className="ml-2 text-[0.72rem] font-semibold text-coral-600 uppercase">Unpublished</span>}
                  </p>
                  <p className="text-[0.85rem] text-muted truncate">{t.role}</p>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
