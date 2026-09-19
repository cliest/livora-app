import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Seo from '../../components/Seo.jsx';
import { TextField } from '../../components/ui/FormField.jsx';
import { adminLoginSchema } from '../../lib/formSchemas.js';
import { api, ApiError } from '../../lib/api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(adminLoginSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      const res = await api.adminLogin(data);
      queryClient.setQueryData(['admin-me'], res);
      navigate('/admin', { replace: true });
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-s3">
      <Seo title="Admin Login | Livora Dental Clinic" description="Staff sign-in." path="/admin/login" noindex />
      <div className="w-full max-w-[400px] bg-white rounded-[18px] p-s5 shadow-lg">
        <span className="text-[1.2rem] font-extrabold text-ink">Livora</span>
        <span className="block text-[0.75rem] uppercase tracking-[0.12em] text-cyan-700 mb-s4">Admin sign-in</span>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-s3">
          <TextField label="Email" name="email" register={register} error={errors.email} type="email" required autoFocus />
          <TextField label="Password" name="password" register={register} error={errors.password} type="password" required />

          {serverError && (
            <div className="bg-coral-wash border border-coral-600/30 text-coral-600 text-[0.9rem] font-semibold rounded-xl px-4 py-3">
              {serverError}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn btn--primary btn--block disabled:opacity-60">
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
