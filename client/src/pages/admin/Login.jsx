import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Seo from '../../components/Seo.jsx';
import { TextField } from '../../components/ui/FormField.jsx';
import { adminLoginSchema } from '../../lib/formSchemas.js';
import { api, inlineErrorMessage } from '../../admin/api.js';
import { reportServiceError } from '../../lib/serviceErrors.js';

const errorBox = 'bg-coral-wash border border-coral-600/30 text-coral-600 text-[0.9rem] font-semibold rounded-xl px-4 py-3';

// Two steps: email + password, then a 6-digit code from an authenticator
// app. An account without two-factor yet is walked through setting it up
// (scan a QR code, enter the first code) in place of the second step.
export default function AdminLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState('password'); // 'password' | 'totp' | 'setup'
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState('');
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(adminLoginSchema) });

  const fail = (err) => {
    reportServiceError(err);
    if (err.restart) {
      setStep('password');
      setSetup(null);
      setCode('');
    }
    setServerError(inlineErrorMessage(err, 'Something went wrong. Please try again.'));
  };

  const onPassword = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      const res = await api.adminLogin(data);
      setSetup(res.setup || null);
      setStep(res.next);
    } catch (err) {
      fail(err);
    } finally {
      setSubmitting(false);
    }
  };

  const onCode = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!/^\d{6}$/.test(code)) {
      setServerError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.adminVerifyCode(code);
      queryClient.setQueryData(['admin-me'], res);
      navigate('/', { replace: true });
    } catch (err) {
      setCode('');
      fail(err);
    } finally {
      setSubmitting(false);
    }
  };

  const startOver = () => {
    setStep('password');
    setSetup(null);
    setCode('');
    setServerError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-s3 py-s5">
      <Seo title="Staff sign-in | Livora Dental Clinic" description="Staff sign-in." noindex />
      <div className="w-full max-w-[420px] bg-white rounded-[18px] p-s5 max-[480px]:p-s3 shadow-lg">
        <span className="text-[1.2rem] font-extrabold text-ink">Livora</span>
        <span className="block text-[0.75rem] uppercase tracking-[0.12em] text-cyan-700 mb-s4">Staff sign-in</span>

        {step === 'password' && (
          <form onSubmit={handleSubmit(onPassword)} noValidate className="flex flex-col gap-s3">
            <TextField label="Email" name="email" register={register} error={errors.email} type="email" autoComplete="username" required autoFocus />
            <TextField label="Password" name="password" register={register} error={errors.password} type="password" autoComplete="current-password" required />
            {serverError && <div className={errorBox}>{serverError}</div>}
            <button type="submit" disabled={submitting} className="btn btn--primary btn--block disabled:opacity-60">
              {submitting ? 'Checking…' : 'Continue'}
            </button>
          </form>
        )}

        {step !== 'password' && (
          <form onSubmit={onCode} noValidate className="flex flex-col gap-s3">
            {step === 'setup' && setup ? (
              <div>
                <h1 className="text-[1.15rem] mb-s1">Set up two-step sign-in</h1>
                <ol className="list-decimal pl-5 text-[0.9rem] text-muted space-y-1 mb-s2">
                  <li>
                    Install an authenticator app on your phone, such as Google Authenticator or Microsoft
                    Authenticator.
                  </li>
                  <li>In the app, add an account and scan this code.</li>
                  <li>Type the 6-digit code the app shows.</li>
                </ol>
                <img src={setup.qr} alt="QR code to add your Livora account to an authenticator app" width="220" height="220" className="mx-auto border border-line" />
                <details className="mt-s2 text-[0.82rem] text-muted">
                  <summary className="cursor-pointer font-semibold">Can’t scan it?</summary>
                  <p className="mt-1">Choose “enter a setup key” in the app and type:</p>
                  <code className="block mt-1 p-2 bg-sand text-ink font-mono text-[0.85rem] break-all select-all">{setup.secret.match(/.{1,4}/g).join(' ')}</code>
                </details>
              </div>
            ) : (
              <div>
                <h1 className="text-[1.15rem] mb-s1">Enter your code</h1>
                <p className="text-[0.9rem] text-muted">Open your authenticator app and type the 6-digit code for Livora.</p>
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-[0.85rem] font-bold text-ink mb-[7px]">
                6-digit code
              </label>
              <input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoFocus
                placeholder="123456"
                className="w-full font-sans text-[1.4rem] tracking-[0.4em] text-center text-ink px-[17px] py-[13px] bg-sand border-[1.5px] border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-cyan"
              />
            </div>

            {serverError && <div className={errorBox}>{serverError}</div>}

            <button type="submit" disabled={submitting} className="btn btn--primary btn--block disabled:opacity-60">
              {submitting ? 'Signing in…' : step === 'setup' ? 'Turn on and sign in' : 'Sign in'}
            </button>
            <button type="button" onClick={startOver} className="text-[0.85rem] font-semibold text-cyan-700 hover:underline self-center">
              Use a different account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
