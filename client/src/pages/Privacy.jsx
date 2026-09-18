import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Section from '../components/ui/Section.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import { useSiteSettings } from '../hooks/useSiteSettings.js';

const LAST_UPDATED = 'September 2026';

export default function Privacy() {
  const settings = useSiteSettings();

  return (
    <>
      <Seo
        title="Privacy Policy | Livora Dental Clinic"
        description="How Livora Dental Clinic collects, uses and protects the personal information you share with us through our website."
        path="/privacy"
      />

      <PageHero image="/img/livora-reception-area.jpg" crumb="Privacy Policy" title="Privacy policy" lead={`Last updated ${LAST_UPDATED}. This explains what we collect through this website, why, and what you can do about it.`} />

      <Section>
        <div className="max-w-[780px] mx-auto legal-content">
          <div className="mb-s4 bg-coral/10 border border-coral/30 rounded-xl px-4 py-3 text-[0.85rem] text-coral-600">
            <strong>Before this goes live:</strong> this policy accurately describes what the Livora website
            technically collects and does today. It has not been reviewed by a lawyer and does not reference
            every obligation the clinic may have under Zambia&rsquo;s Data Protection Act (No. 3 of 2021) as a
            healthcare provider. Have it checked by qualified counsel before publishing.
          </div>

          <h2>Who we are</h2>
          <p>
            Livora Dental Clinic (&ldquo;Livora&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this website
            and the dental clinic it describes, based at {settings.addressLine1}, {settings.addressLine2}. This
            policy covers the website at livoradentalclinic.com — it does not cover information we collect from
            you in person at reception, which is handled under our in-clinic patient records process.
          </p>

          <h2>What we collect</h2>
          <p>We only collect what you give us directly, through two forms on this site:</p>
          <p><strong>The booking form (&ldquo;Book an Appointment&rdquo;):</strong></p>
          <ul>
            <li>Full name and phone number (required)</li>
            <li>Email address (optional)</li>
            <li>Whether you&rsquo;re a new or returning patient</li>
            <li>The treatment you&rsquo;re requesting, and your preferred date and time</li>
            <li>Whether you&rsquo;re an NHIMA member</li>
            <li>Anything you choose to tell us in the free-text message — this can include symptoms or health
              information you volunteer</li>
          </ul>
          <p><strong>The contact form:</strong></p>
          <ul>
            <li>Full name, email address, and phone number (optional)</li>
            <li>The subject of your message and the message itself</li>
          </ul>
          <p>
            For both forms, we also automatically log the IP address and browser (&ldquo;user agent&rdquo;) the
            submission came from. This is kept only for security and spam-prevention purposes — to spot abuse of
            the forms — and is never shown to clinic staff alongside your request in the admin dashboard.
          </p>
          <p>
            We do not use cookies for tracking or advertising, and this site does not run Google Analytics or any
            similar third-party analytics or advertising service. The only cookie this site sets is a session
            cookie for clinic staff signing in to the admin dashboard — it identifies a logged-in staff member,
            not a visitor, is not readable by any script, and is never set for anyone submitting the public forms.
          </p>

          <h2>Why we collect it, and what we do with it</h2>
          <p>
            Everything submitted through the booking and contact forms goes to our clinic&rsquo;s admin system, so
            that a member of the Livora team can call or message you back to confirm your appointment or answer
            your question. We don&rsquo;t use it for anything else — no marketing lists, no sale or sharing of
            your details to third parties for their own purposes.
          </p>
          <p>
            If you tick the consent box on either form, you&rsquo;re agreeing to let us contact you back by phone,
            SMS, WhatsApp or email about that specific request. We don&rsquo;t contact you for any other reason
            based on a website form submission.
          </p>

          <h2>Who can see it</h2>
          <p>
            Booking requests and messages are visible only to Livora staff with an admin login, through a
            password-protected dashboard. If email notifications are configured, a copy of each new submission is
            also sent to the clinic&rsquo;s notification inbox via our email provider, solely so a new request
            isn&rsquo;t missed overnight.
          </p>
          <p>
            We use a third-party hosting provider to run this website and store this data securely; they do not
            use it for their own purposes. We do not sell, rent, or otherwise share your information with anyone
            else.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Booking and contact records are kept for as long as they&rsquo;re useful for clinic administration and
            continuity of care, and then deleted. If you&rsquo;d like your website submission history removed
            sooner, contact us using the details below and we&rsquo;ll action it, subject to any records we&rsquo;re
            required to keep for legal, medical or accounting reasons.
          </p>

          <h2>Your rights</h2>
          <p>You can ask us at any time to:</p>
          <ul>
            <li>Tell you what information we hold about you from this website</li>
            <li>Correct anything that&rsquo;s wrong</li>
            <li>Delete your booking or contact history, where we&rsquo;re not required to keep it</li>
            <li>Stop contacting you about a request you submitted</li>
          </ul>
          <p>Reach us using the contact details below and we&rsquo;ll respond promptly.</p>

          <h2>Children</h2>
          <p>
            We treat children as patients every day, and a parent or guardian is welcome to book or enquire on a
            child&rsquo;s behalf through these forms. We don&rsquo;t knowingly collect information submitted
            directly by a child without an adult&rsquo;s involvement.
          </p>

          <h2>Security</h2>
          <p>
            Form submissions are transmitted securely and stored in a password-protected database that only
            authenticated clinic staff can access. As with any online system, no method of transmission or storage
            is completely without risk, but we take reasonable, standard precautions to protect your information.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If how we handle your information changes, we&rsquo;ll update this page and change the date at the
            top.
          </p>

          <h2>Contact us</h2>
          <p>
            Questions about this policy, or a request about your data, can go to{' '}
            <a href={`mailto:${settings.email}`}>{settings.email}</a> or{' '}
            <a href={settings.telHref}>{settings.phoneDisplay}</a>. You can also use our{' '}
            <Link to="/contact">contact form</Link>.
          </p>
        </div>
      </Section>
    </>
  );
}
