import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Seo from '../../components/Seo.jsx';
import { TextField } from '../../components/ui/FormField.jsx';
import { createAdminUserSchema, updateAdminUserSchema } from '../../lib/formSchemas.js';
import { api, ApiError } from '../../lib/api.js';

const EMPTY_CREATE = { name: '', email: '', password: '' };

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');

  // Reuses the session data RequireAdmin already fetched under this same
  // query key — this doesn't trigger a second network request.
  const { data: me } = useQuery({ queryKey: ['admin-me'], queryFn: api.adminMe });
  const myId = me?.admin?.id;

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.adminListUsers()).users,
  });

  const createSchema = createAdminUserSchema;
  const editSchema = updateAdminUserSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editingId ? editSchema : createSchema),
    defaultValues: EMPTY_CREATE,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-users'] });

  const createMutation = useMutation({ mutationFn: api.createAdminUser, onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, payload }) => api.updateAdminUser(id, payload), onSuccess: invalidate });
  const deleteMutation = useMutation({ mutationFn: api.deleteAdminUser, onSuccess: invalidate });

  const startEdit = (user) => {
    setEditingId(user.id);
    setFormError('');
    reset({ name: user.name || '', password: '' });
  };
  const startAdd = () => {
    setEditingId(null);
    setFormError('');
    reset(EMPTY_CREATE);
  };

  const onSubmit = async (data) => {
    setFormError('');
    try {
      if (editingId) {
        const payload = { name: data.name };
        if (data.password) payload.password = data.password;
        await updateMutation.mutateAsync({ id: editingId, payload });
      } else {
        await createMutation.mutateAsync(data);
      }
      startAdd();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Something went wrong.');
    }
  };

  const handleDelete = (user) => {
    if (confirm(`Remove ${user.name || user.email}'s admin access?`)) deleteMutation.mutate(user.id);
  };

  return (
    <div>
      <Seo title="Admin Users | Livora Admin" description="Manage who can sign in to the dashboard." path="/admin/users" noindex />
      <h1 className="text-[1.6rem] mb-4">Admin users</h1>
      <p className="text-muted mb-s4 max-w-[560px]">
        Anyone listed here can sign in to this dashboard with their own email and password.
      </p>

      <div className="flex flex-wrap gap-s4">
        <div className="flex-1 min-w-[320px]">
          <div className="bg-white border border-line rounded-[18px] p-s4">
            <h2 className="text-[1.1rem] mb-s3">{editingId ? 'Edit user' : 'Add a user'}</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-s3">
              <TextField label="Name" name="name" register={register} error={errors.name} required />
              {!editingId && (
                <TextField label="Email" name="email" register={register} error={errors.email} type="email" required />
              )}
              <TextField
                label={editingId ? 'New password' : 'Password'}
                name="password"
                register={register}
                error={errors.password}
                type="password"
                required={!editingId}
                placeholder={editingId ? 'Leave blank to keep current password' : undefined}
              />

              {formError && (
                <div className="bg-coral-wash border border-coral-600/30 text-coral-600 text-[0.9rem] font-semibold rounded-xl px-4 py-3">
                  {formError}
                </div>
              )}

              <div className="flex gap-s2">
                <button type="submit" disabled={isSubmitting} className="btn btn--primary disabled:opacity-60">
                  {editingId ? 'Save changes' : 'Add user'}
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
            {!isLoading && users.length === 0 && <p className="text-muted">No admin users yet.</p>}
            {users.map((user) => (
              <div key={user.id} className="bg-white border border-line rounded-[18px] p-s3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink truncate">
                    {user.name || '(no name)'}
                    {user.id === myId && <span className="ml-2 text-[0.72rem] font-semibold text-cyan-700 uppercase">You</span>}
                  </p>
                  <p className="text-[0.85rem] text-muted truncate">{user.email}</p>
                  <p className="text-[0.78rem] text-muted mt-0.5">
                    {user.lastLoginAt ? `Last signed in ${new Date(user.lastLoginAt).toLocaleString()}` : 'Never signed in'}
                  </p>
                </div>
                <div className="flex gap-2 flex-none">
                  <button type="button" onClick={() => startEdit(user)} className="btn btn--outline btn--sm">
                    Edit
                  </button>
                  {user.id !== myId && (
                    <button type="button" onClick={() => handleDelete(user)} className="btn btn--outline btn--sm text-coral-600">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
