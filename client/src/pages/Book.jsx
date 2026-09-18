import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Seo from '../components/Seo.jsx';
import Section from '../components/ui/Section.jsx';
import PhoneIcon from '../components/layout/PhoneIcon.jsx';
import { TextField, SelectField, TextAreaField, PillGroup, ConsentCheckbox } from '../components/ui/FormField.jsx';
import { bookingFormSchema, SERVICE_OPTIONS } from '../lib/formSchemas.js';
import { api, ApiError } from '../lib/api.js';
import { IconClock } from '../components/ui/icons.jsx';
import { useSiteSettings } from '../hooks/useSiteSettings.js';

const TIME_OPTIONS = [
  ['morning', 'Morning (07:00–12:00)'],
  ['afternoon', 'Afternoon (12:00–17:00)'],
  ['evening', 'Evening (17:00–22:00)'],
  ['night', 'Overnight (22:00–07:00)'],
];

const NHIMA_OPTIONS = [
  ['yes', 'Yes — I will bring my card'],
  ['no', 'No — I will pay directly'],
  ['unsure', 'I am not sure'],
];

const PATIENT_OPTIONS = [
  ['new', 'This would be my first visit'],
  ['returning', 'I am a returning patient'],
];

export default function Book() {
  const navigate = useNavigate();
  const settings = useSiteSettings();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { preferredTime: 'morning' },
  });

  const today = new Date().toISOString().slice(0, 10);

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      await api.submitBooking(data);
      navigate('/thank-you');
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, message]) => setError(field, { message }));
      } else {
        setServerError(err.message || 'Something went wrong. Please call us instead.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Book a Dental Appointment in Lusaka | Livora Dental Clinic"
        description="Book your dental appointment at Livora Dental Clinic in Lusaka. Open 24/7, NHIMA accepted."
        path="/book"
      />

      {/* Page hero */}
      <section className="relative bg-ink text-white overflow-hidden isolate">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[.38]"
          style={{ backgroundImage: "url('/img/livora-dental-suite.jpg')" }}
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(90deg, rgba(10,42,51,.92) 12%, rgba(10,42,51,.62) 100%)' }}
        />
        <div className="container relative z-[2]">
          <div className="max-w-[760px] pt-[92px] pb-[96px] max-[1024px]:pt-[68px] max-[1024px]:pb-[72px]">
            <ul className="flex flex-wrap items-center gap-2 text-[0.82rem] text-[#8FB2BD] mb-s2 list-none p-0">
              <li>
                <Link to="/" className="text-[#BCD6DE] hover:text-cyan">
                  Home
                </Link>
              </li>
              <li className="before:content-['/'] before:mr-2 before:text-[#5E7A82]">Book an Appointment</li>
            </ul>
            <h1 className="text-white mb-s3">Book your appointment</h1>
            <p className="text-[#BCD6DE] text-[1.2rem]">
              Fill this in and we will call you back to confirm, usually within the hour, and immediately if it is
              urgent. If you would rather just talk to someone, call{' '}
              <a href={settings.telHref} className="text-white underline">
                {settings.phoneDisplay}
              </a>{' '}
              at any hour.
            </p>
          </div>
        </div>
      </section>

      <Section>
        <div className="flex flex-wrap gap-s5">
          {/* Form */}
          <div className="flex-[1.5] min-w-[320px]">
            <div className="bg-white border border-line rounded-[28px] shadow p-s5 max-[767px]:p-s3">
              <h2 className="text-[1.7rem]">Appointment request</h2>
              <p className="lead text-muted text-[1rem] mb-s4">
                Fields marked <span className="text-coral-600">*</span> are required. This is a request, not a
                confirmed slot — we will call you back to confirm the time.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-2 gap-x-s3 gap-y-s3 max-[640px]:grid-cols-1">
                <TextField label="Full name" name="fullName" register={register} error={errors.fullName} required placeholder="e.g. Chanda Mwila" />
                <TextField label="Phone number" name="phone" register={register} error={errors.phone} required type="tel" placeholder="e.g. 097 000 0000" />

                <TextField label="Email address" name="email" register={register} error={errors.email} type="email" placeholder="you@example.com" />
                <SelectField label="Have you been to Livora before?" name="patientType" register={register} error={errors.patientType} options={PATIENT_OPTIONS} />

                <SelectField label="What do you need?" name="service" register={register} error={errors.service} options={SERVICE_OPTIONS} required full />

                <TextField label="Preferred date" name="preferredDate" register={register} error={errors.preferredDate} required type="date" min={today} />
                <SelectField label="Are you a NHIMA member?" name="nhimaMember" register={register} error={errors.nhimaMember} options={NHIMA_OPTIONS} required />

                <PillGroup label="Preferred time" name="preferredTime" register={register} options={TIME_OPTIONS} />

                <TextAreaField
                  label="Anything we should know?"
                  name="message"
                  register={register}
                  error={errors.message}
                  placeholder="Tell us about your symptoms, any medication you take, or anything that makes dental visits difficult for you. Nervous patients — say so here and we will give you a longer appointment."
                />

                <ConsentCheckbox name="consentGiven" register={register} error={errors.consentGiven}>
                  I agree that Livora Dental Clinic may contact me by phone, SMS or WhatsApp about this appointment
                  request. <span className="text-coral-600">*</span>
                </ConsentCheckbox>

                {serverError && (
                  <div className="col-span-2 max-[640px]:col-span-1 bg-[#FFF6F5] border border-coral-600/30 text-coral-600 text-[0.9rem] font-semibold rounded-xl px-4 py-3">
                    {serverError}
                  </div>
                )}

                <div className="col-span-2 max-[640px]:col-span-1">
                  <button type="submit" disabled={submitting} className="btn btn--primary btn--lg btn--block disabled:opacity-60">
                    {submitting ? 'Sending…' : 'Request Appointment'}
                  </button>
                  <p className="text-[0.85rem] text-muted mt-s2">
                    In severe pain? Do not wait for a callback — call{' '}
                    <a href={settings.telHref} className="underline">
                      {settings.phoneDisplay}
                    </a>{' '}
                    and come straight in.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Side panel */}
          <div className="flex-1 min-w-[280px]">
            <div className="bg-ink-800 rounded-[18px] p-s4">
              <span className="inline-flex items-center justify-center w-[58px] h-[58px] rounded-2xl bg-white/10 text-cyan mb-s3">
                <PhoneIcon className="w-[27px] h-[27px]" />
              </span>
              <h3 className="text-white">Would rather just call?</h3>
              <p className="text-[#9FBFC9]">Someone answers this number at every hour of the day and night. No menus, no call-back queue.</p>
              <div className="flex flex-col gap-s2 mt-s3">
                <a href={settings.telHref} className="btn btn--primary btn--block">
                  {settings.phoneDisplay}
                </a>
                <a href={settings.waHref} target="_blank" rel="noopener noreferrer" className="btn btn--ghost-light btn--block">
                  Message on WhatsApp
                </a>
              </div>
            </div>

            <div className="bg-white border border-line rounded-[18px] p-s4 mt-s4">
              <h3>What happens next</h3>
              <div className="flex flex-col gap-s3 mt-s3">
                {[
                  ['We call you back', 'Within the hour during the day, and straight away if you have flagged an emergency.'],
                  ['We confirm your slot', 'We agree a time that actually works for you and send a confirmation by SMS or WhatsApp.'],
                  ['You come in', 'Bring your NRC, and your NHIMA card if you have one. Arrive ten minutes early for a first visit.'],
                ].map(([t, b], i) => (
                  <div key={t} className="flex gap-3">
                    <span className="flex-none w-[42px] h-[42px] rounded-full bg-cyan text-white flex items-center justify-center font-extrabold">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="mb-1">{t}</h4>
                      <p className="text-[0.94rem] text-muted">{b}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-sand rounded-[18px] p-s4 mt-s4">
              <h3 className="flex items-center gap-2">
                <IconClock className="w-[22px] h-[22px] text-cyan" />
                Opening hours
              </h3>
              <p className="mb-s3">We are open continuously, there is no closing time to work around.</p>
              <table className="w-full">
                <tbody>
                  {['Monday – Friday', 'Saturday', 'Sunday', 'Public holidays'].map((d) => (
                    <tr key={d} className="border-b border-line last:border-0">
                      <th className="py-[13px] text-left font-semibold text-ink">{d}</th>
                      <td className="py-[13px] text-right font-bold text-cyan-700">Open 24 hours</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
