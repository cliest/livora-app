import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Section from '../components/ui/Section.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { TextField, SelectField, TextAreaField, ConsentCheckbox } from '../components/ui/FormField.jsx';
import { contactFormSchema, SUBJECT_OPTIONS } from '../lib/formSchemas.js';
import { api, ApiError } from '../lib/api.js';
import { IconPhone, IconClock, IconMapPin, IconMail, IconWhatsapp } from '../components/ui/icons.jsx';

export default function Contact() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    setSubmitting(true);
    try {
      await api.submitContact(data);
      navigate('/thank-you');
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, message]) => setError(field, { message }));
      } else {
        setServerError(err.message || 'Something went wrong. Please email or call us instead.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact Livora Dental Clinic | Lusaka | +260 76 073 7805"
        description="Contact Livora Dental Clinic in Lusaka, Zambia. Open 24 hours a day, every day. Call +260 76 073 7805, WhatsApp us or email info@livoradentalclinic.com."
        path="/contact"
      />

      <PageHero
        image="/img/livora-reception-area.jpg"
        crumb="Contact"
        title="Get in touch"
        lead="Call, message or walk in — at any hour of any day. Livora does not close."
      />

      {/* Three contact methods */}
      <Section>
        <div className="grid md:grid-cols-3 gap-s3">
          {[
            [IconPhone, 'Call us', 'Answered 24 hours a day, every day. This is the fastest way to reach us.', '+260 76 073 7805', 'tel:+260760737805'],
            [IconWhatsapp, 'WhatsApp', 'Send a photo of the problem and a quick description. Useful for non-urgent questions.', 'wa.me/260760737805', 'https://wa.me/260760737805'],
            [IconMail, 'Email', 'For enquiries, records requests, invoices and anything that is not urgent.', 'info@livoradentalclinic.com', 'mailto:info@livoradentalclinic.com'],
          ].map(([Icon, title, body, value, href]) => (
            <div key={title} className="bg-white border border-line rounded-[18px] p-s4 hover:shadow-card hover:-translate-y-1 transition-all">
              <span className="inline-flex items-center justify-center w-[58px] h-[58px] rounded-2xl bg-cyan text-white mb-s3">
                <Icon className="w-[27px] h-[27px]" />
              </span>
              <h3>{title}</h3>
              <p className="text-muted mb-s2">{body}</p>
              <a href={href} className="text-[1.05rem] font-extrabold text-ink hover:text-cyan-700" target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                {value}
              </a>
            </div>
          ))}
        </div>
      </Section>

      {/* Form + hours */}
      <Section bg="sand">
        <div className="flex flex-wrap gap-s5">
          <div className="flex-[1.5] min-w-[320px]">
            <div className="bg-white border border-line rounded-[28px] shadow p-s5 max-[767px]:p-s3">
              <span className="eyebrow">Send a message</span>
              <h2 className="text-[1.8rem]">Ask us anything</h2>
              <p className="lead text-muted text-[1rem] mb-s4">
                We answer every message. If it is urgent, please call instead — email is slower than our phone line.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-2 gap-x-s3 gap-y-s3 max-[640px]:grid-cols-1">
                <TextField label="Your name" name="fullName" register={register} error={errors.fullName} required />
                <TextField label="Email address" name="email" register={register} error={errors.email} required type="email" />

                <TextField label="Phone number" name="phone" register={register} error={errors.phone} type="tel" />
                <SelectField label="What is this about?" name="subject" register={register} error={errors.subject} options={SUBJECT_OPTIONS} required />

                <TextAreaField label="Your message" name="message" register={register} error={errors.message} required />

                <ConsentCheckbox name="consentGiven" register={register} error={errors.consentGiven}>
                  I agree that Livora Dental Clinic may use these details to reply to my message.{' '}
                  <span className="text-coral-600">*</span>
                </ConsentCheckbox>

                {serverError && (
                  <div className="col-span-2 max-[640px]:col-span-1 bg-[#FFF6F5] border border-coral-600/30 text-coral-600 text-[0.9rem] font-semibold rounded-xl px-4 py-3">
                    {serverError}
                  </div>
                )}

                <div className="col-span-2 max-[640px]:col-span-1">
                  <button type="submit" disabled={submitting} className="btn btn--primary btn--lg btn--block disabled:opacity-60">
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="flex-1 min-w-[280px]">
            <div className="bg-white border border-line rounded-[18px] p-s4">
              <span className="inline-flex items-center justify-center w-[58px] h-[58px] rounded-2xl bg-sand-deep text-cyan-700 mb-s3">
                <IconClock className="w-[27px] h-[27px]" />
              </span>
              <h3>Opening hours</h3>
              <p className="text-muted">Livora is open continuously, all year. There is always a qualified dentist on duty, not an answering service.</p>
              <table className="w-full mt-s3">
                <tbody>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Public holidays'].map((d) => (
                    <tr key={d} className="border-b border-line last:border-0">
                      <th className="py-[13px] text-left font-semibold text-ink">{d}</th>
                      <td className="py-[13px] text-right font-bold text-cyan-700">24 hours</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border border-line rounded-[18px] p-s4 mt-s4">
              <span className="inline-flex items-center justify-center w-[58px] h-[58px] rounded-2xl bg-sand-deep text-cyan-700 mb-s3">
                <IconMapPin className="w-[27px] h-[27px]" />
              </span>
              <h3>Find us</h3>
              {/* PLACEHOLDER: replace with the confirmed street address */}
              <p className="font-bold">
                Plot 00, Street Name
                <br />
                Lusaka, Zambia
              </p>
              <p className="text-muted mt-s3">
                Parking is available on site. If you are coming in with a dental emergency, come straight to
                reception and say so — you will not be asked to wait in the general queue.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Map placeholder */}
      <Section size="sm">
        <div className="max-w-[720px] mx-auto text-center mb-s6">
          <span className="eyebrow justify-center">Location</span>
          <h2>How to find the clinic</h2>
        </div>
        <div className="aspect-video rounded-[28px] bg-sand-deep border-2 border-dashed border-[#B9D2DA] flex flex-col items-center justify-center text-center p-s4">
          <IconMapPin className="w-10 h-10 text-cyan mb-s2" />
          <strong className="block text-[1.05rem] mb-1.5">Map embed goes here</strong>
          <span className="text-[0.9rem] text-muted max-w-[420px]">
            Once the clinic address is confirmed, drop a Google Maps embed into this container.
          </span>
        </div>
      </Section>
    </>
  );
}
