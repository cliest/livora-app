import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Section from '../components/ui/Section.jsx';
import { IconCheckCircle, IconPhone, IconClock, IconIdCard } from '../components/ui/icons.jsx';

export default function ThankYou() {
  return (
    <>
      <Seo
        title="Thank You | Livora Dental Clinic"
        description="Thank you for contacting Livora Dental Clinic. We will call you back to confirm your appointment."
        path="/thank-you"
        noindex
      />

      <Section size="default">
        <div className="max-w-[860px] mx-auto text-center">
          <span className="inline-flex items-center justify-center w-[82px] h-[82px] rounded-[24px] bg-cyan text-white mx-auto mb-s2">
            <IconCheckCircle className="w-[38px] h-[38px]" />
          </span>
          <h1>
            Thank you —<br />
            we have your request
          </h1>
          <p className="lead text-muted mt-s3">
            A member of the Livora team will call you back to confirm your appointment. During the day that is
            usually within the hour; overnight it may be a little longer, unless you flagged an emergency.
          </p>
          <div className="flex flex-wrap gap-s2 justify-center mt-s5">
            <Link to="/" className="btn btn--primary btn--lg">
              Back to the homepage
            </Link>
            <Link to="/services" className="btn btn--outline btn--lg">
              Browse our services
            </Link>
          </div>
        </div>
      </Section>

      <Section bg="sand" size="sm">
        <div className="max-w-[720px] mx-auto text-center mb-s6">
          <span className="eyebrow justify-center">While you wait</span>
          <h2>A few useful things</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-s3">
          {[
            [IconPhone, 'In pain now?', 'Do not wait for the callback. Call us on +260 76 073 7805 and come straight in, we are open.'],
            [IconIdCard, 'Bring with you', 'Your NRC, your NHIMA card if you have one, and a list of any medication you take.'],
            [IconClock, 'Need to change it?', 'Call or WhatsApp us any time and we will move your appointment, no charge, no fuss.'],
          ].map(([Icon, title, body]) => (
            <div key={title} className="bg-white border border-line rounded-[18px] p-s4">
              <span className="inline-flex items-center justify-center w-[58px] h-[58px] rounded-2xl bg-sand-deep text-cyan-700 mb-s3">
                <Icon className="w-[27px] h-[27px]" />
              </span>
              <h3>{title}</h3>
              <p className="text-muted">{body}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
