import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Seo from '../components/Seo.jsx';
import Section from '../components/ui/Section.jsx';
import SectionHead from '../components/ui/SectionHead.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import ImageCard from '../components/ui/ImageCard.jsx';
import Step from '../components/ui/Step.jsx';
import PriceBlock from '../components/ui/PriceBlock.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import CtaBand from '../components/ui/CtaBand.jsx';
import PhoneIcon from '../components/layout/PhoneIcon.jsx';
import { IconBolt } from '../components/ui/icons.jsx';
import { useSiteSettings } from '../hooks/useSiteSettings.js';
import { api } from '../lib/api.js';

const SYMPTOMS = [
  ['/img/toothache-jaw-pain.jpg', 'Severe toothache', 'Pain that keeps you awake, throbs constantly, or does not respond to normal painkillers. This almost always means infection.'],
  ['/img/dental-checkup-patient.jpg', 'Knocked-out tooth', 'An adult tooth knocked out can often be re-implanted, but only within about an hour. Call while you are on your way.'],
  ['/img/facial-swelling-pain.jpg', 'Facial swelling', 'Swelling of the face, jaw or under the eye means the infection is spreading. This is urgent, even without much pain.'],
  ['/img/braces-close-up.jpg', 'Broken or cracked tooth', 'A fractured tooth exposes the nerve and gets worse quickly. We can usually stabilise it the same day.'],
  ['/img/crowns-and-bridges.jpg', 'Lost filling or crown', 'The tooth underneath is unprotected and will become sensitive fast. Bring the crown with you if you still have it.'],
  ['/img/gloved-hand-detail.jpg', 'Bleeding that will not stop', 'Persistent bleeding from the gums or from an extraction site needs to be looked at rather than waited out.'],
];

const TONIGHT_STEPS = [
  ['Rinse with warm salt water', 'Half a teaspoon of salt in a cup of warm water. It cleans the area and eases inflamed gum tissue.'],
  ['Take your usual painkiller', 'Whatever you would normally take for pain, at the normal dose. Anti-inflammatories tend to work best on dental pain.'],
  ['Cold compress on the outside', 'Against the cheek, twenty minutes on and twenty off. This helps most with swelling and throbbing.'],
  ['Keep your head raised', 'Lying flat increases pressure in the tooth. Prop yourself up on an extra pillow.'],
  ['Do not put aspirin on the gum', 'It burns the soft tissue and makes things worse. Swallow painkillers, never place them against the tooth.'],
];

const ARRIVAL_STEPS = [
  ['You are seen, not queued', 'Emergency patients are assessed on arrival, at any hour. You will not sit in a waiting room for three hours in pain.'],
  ['We find the cause', 'An examination and, where needed, a digital X-ray, on screen in seconds, so we can show you exactly what is happening.'],
  ['We stop the pain today', 'Draining an abscess, starting a root canal, a temporary filling or an extraction. Whatever it takes to end it tonight.'],
  ['We plan the repair', 'Once you are comfortable, we quote the permanent fix in writing and book it for whenever suits you.'],
];

const FAQS = [
  { q: 'Do I need an appointment for an emergency?', a: 'No. If you are in significant pain, come in. Calling first on <a href="tel:+260760737805" class="underline">+260 76 073 7805</a> helps us prepare for you and cuts your waiting time, but you will never be turned away for arriving unannounced.' },
  { q: 'Are you really open at night and on Sundays?', a: 'Yes, 24 hours a day, 7 days a week, 365 days a year, public holidays included. There is always a qualified dentist on duty, not just a receptionist taking messages.' },
  { q: 'My tooth was knocked out. What do I do?', a: 'Pick it up by the crown, never the root. If it is dirty, rinse it briefly in milk or saline, not tap water, and do not scrub it. If you can, push it gently back into the socket and bite on a clean cloth. If not, keep it in a cup of milk and get to us within the hour.' },
  { q: 'Is after-hours treatment more expensive?', a: 'The emergency examination fee is slightly higher outside normal hours, because of the on-call staffing. The treatment itself is charged at the same rate as it would be at midday. You will always be told the total before we begin.' },
  { q: 'Can I use NHIMA for an emergency visit?', a: 'Yes. Bring your NHIMA card and NRC. Cover varies depending on the treatment needed, so our front desk will confirm what is covered and what you would pay yourself before treatment starts.' },
  { q: 'My child has a dental emergency. Will you see them?', a: "Absolutely, at any hour. Tell us their age when you call so the right clinician is ready. Knocked-out baby teeth are handled differently from adult teeth, so do not try to reinsert a child's tooth, bring them straight in." },
];

export default function Emergency() {
  const settings = useSiteSettings();
  const { data: priceCategories = [] } = useQuery({
    queryKey: ['prices'],
    queryFn: async () => (await api.getPrices()).categories,
  });
  const emergencyItems = priceCategories.flatMap((c) => c.items.filter((i) => i.isEmergency));

  return (
    <>
      <Seo
        title="24/7 Emergency Dentist in Lusaka | Toothache & Dental Pain | Livora"
        description="Emergency dentist near you in Lusaka, open 24 hours. Severe toothache, knocked-out teeth, abscess, swelling and broken fillings treated the same day."
        path="/emergency"
      />

      <PageHero image="/img/dental-checkup-patient.jpg" crumb="24/7 Emergency" title="Emergency dentist,<br>open right now" lead="If you are searching for an emergency dentist near you in Lusaka at two in the morning, stop reading and call. There is a dentist on duty at Livora every hour of every day.">
        <div className="flex flex-wrap gap-s2 mt-s4">
          <a href={settings.telHref} className="btn btn--coral btn--lg">
            <PhoneIcon />
            Call {settings.phoneDisplay}
          </a>
          <a href={settings.waHref} target="_blank" rel="noopener noreferrer" className="btn btn--ghost-light btn--lg">
            WhatsApp us
          </a>
        </div>
      </PageHero>

      {/* urgency strip */}
      <div className="bg-coral py-s4 max-[767px]:py-9">
        <div className="container">
          <div className="flex flex-wrap items-center gap-s3">
            <div className="flex-1 min-w-[260px]">
              <h2 className="text-white mb-1">Do not sit through the night in pain</h2>
              <p className="text-white/[.93] m-0">Untreated dental infection spreads. What is a filling tonight can be an extraction by the weekend.</p>
            </div>
            <div className="flex-none w-full sm:w-auto">
              <a href={settings.telHref} className="btn btn--white btn--lg btn--block">
                Call {settings.phoneDisplay} now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* six symptom cards */}
      <Section>
        <SectionHead eyebrow="When to call us immediately" title="What counts as a<br>dental emergency" lead="If any of these describe you right now, do not wait for a scheduled appointment." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-s3">
          {SYMPTOMS.map(([image, title, body]) => (
            <ImageCard key={title} image={image} alt={title} title={title} body={body} />
          ))}
        </div>
      </Section>

      {/* what to do tonight */}
      <Section bg="sand">
        <div className="flex flex-wrap gap-s5">
          <div className="flex-1 min-w-[320px]">
            <span className="eyebrow">Right now, before you get here</span>
            <h2>What to do about a toothache tonight</h2>
            <p className="lead text-muted mb-s4">These will not fix the problem, but they will make the next hour bearable.</p>
            <div className="flex flex-col gap-s3">
              {TONIGHT_STEPS.map(([t, b], i) => (
                <Step key={t} n={i + 1} title={t} body={b} />
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-[320px]">
            <img src="/img/tooth-decay-examination.jpg" alt="Close-up of a decayed tooth being examined during an emergency dental appointment" className="rounded-[18px] w-full mb-s4" />
            <div className="bg-ink-800 rounded-[18px] p-s4">
              <h3 className="text-white">And then call us</h3>
              <p className="text-[#9FBFC9]">
                None of the above treats the cause. Dental pain that lasts more than a day is a problem that will
                not resolve on its own, and it is far cheaper and simpler to treat early.
              </p>
              <a href={settings.telHref} className="btn btn--coral mt-s3">
                <PhoneIcon />
                Call {settings.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* four arrival steps */}
      <Section>
        <SectionHead eyebrow="What happens when you arrive" title="Four steps, and you<br>are out of pain" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-s3">
          {ARRIVAL_STEPS.map(([t, b], i) => (
            <Step key={t} n={i + 1} title={t} body={b} />
          ))}
        </div>
      </Section>

      {/* emergency pricing */}
      <Section bg="sand">
        <div className="flex flex-wrap gap-s5">
          <div className="flex-1 min-w-[320px]">
            <span className="eyebrow">Emergency costs</span>
            <h2>What an emergency visit costs</h2>
            <p className="lead text-muted">
              You get the price before we touch anything, even at 3am. NHIMA is accepted for emergency treatment,
              and we take cash, card and mobile money.
            </p>
            <div className="flex flex-wrap gap-s2 mt-s4">
              <Link to="/pricing" className="btn btn--primary">
                Full price list
              </Link>
              <Link to="/book" className="btn btn--outline">
                Book an appointment
              </Link>
            </div>
          </div>
          <div className="flex-1 min-w-[320px]">
            <PriceBlock
              icon={IconBolt}
              title="Emergency treatment"
              rows={emergencyItems.map((item) => [item.name, item.price])}
              note="Prices in Zambian Kwacha and indicative only. Your exact quote is confirmed after examination, before any treatment starts."
            />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="max-w-[860px] mx-auto">
          <SectionHead eyebrow="Emergency questions" title="Frequently asked" />
          <Accordion items={FAQS} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
