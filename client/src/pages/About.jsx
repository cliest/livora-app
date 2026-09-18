import { useQuery } from '@tanstack/react-query';
import Seo from '../components/Seo.jsx';
import Section from '../components/ui/Section.jsx';
import SectionHead from '../components/ui/SectionHead.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import ImageCard from '../components/ui/ImageCard.jsx';
import CtaBand from '../components/ui/CtaBand.jsx';
import { api } from '../lib/api.js';

const PROMISES = [
  ['/img/livora-reception-area.jpg', 'We will be open', 'Every hour of every day, including public holidays. If you are in pain, you do not wait for Monday.'],
  ['/img/dentist-writing-quote.jpg', 'We will quote first', 'A written price before treatment starts. If anything changes, we pause and talk to you before continuing.'],
  ['/img/digital-dental-xray.jpg', 'We will show you', 'Digital X-rays and an intraoral camera mean you see what we see, on a screen, before you decide anything.'],
  ['/img/child-checkup-parent.jpg', 'We will not rush you', 'Appointments have room built in for questions. Nervous patients get longer slots and a stop signal they control.'],
];

const TECH_IMAGES = [
  ['/img/digital-dental-xray.jpg', 'Dentist reviewing digital dental X-ray images'],
  ['/img/livora-surgery-room.jpg', 'Modern dental surgery room with chair and equipment'],
  ['/img/dental-cleaning-treatment.jpg', 'Professional dental cleaning treatment in progress'],
  ['/img/livora-dental-suite.jpg', 'A bright, fully equipped dental suite'],
];

const GALLERY = [
  ['/img/livora-reception-area.jpg', 'Reception and waiting area at Livora Dental Clinic'],
  ['/img/livora-consultation-room.jpg', 'Consultation room at Livora Dental Clinic'],
  ['/img/livora-treatment-room.jpg', 'Treatment room and dental chair at Livora Dental Clinic'],
  ['/img/dentist-at-work.jpg', 'A Livora dentist treating a patient'],
  ['/img/dental-patient-consultation.jpg', 'A dentist talking a patient through their treatment'],
  ['/img/livora-dental-suite.jpg', 'Dental suite with equipment at Livora Dental Clinic'],
];

export default function About() {
  const { data: team = [] } = useQuery({ queryKey: ['team'], queryFn: async () => (await api.getTeam()).items });

  return (
    <>
      <Seo
        title="About Livora Dental Clinic | Trusted Dental Care in Lusaka, Zambia"
        description="Meet the team behind Livora Dental Clinic in Lusaka. Registered dentists, modern technology, transparent pricing and a clinic that is genuinely open 24/7."
        path="/about"
      />

      <PageHero
        image="/img/livora-reception-area.jpg"
        crumb="About"
        title="Dentistry without the dread"
        lead="Livora Dental Clinic was built around a stubborn belief: good dental care should be available when you actually need it, explained in language you understand, and priced before it starts."
      />

      {/* Our story */}
      <Section>
        <div className="flex flex-wrap items-center gap-s5">
          <div className="flex-1 min-w-[320px]">
            <img src="/img/livora-treatment-room.jpg" alt="The main treatment room at Livora Dental Clinic in Lusaka" className="rounded-[28px] w-full" />
          </div>
          <div className="flex-1 min-w-[320px]">
            <span className="eyebrow">Our story</span>
            <h2>We opened the doors that stay shut everywhere else</h2>
            <p className="lead text-muted">
              Ask anyone in Lusaka about their last dental emergency and you will hear the same story — the pain
              started on a Friday night, and the waiting started with it.
            </p>
            <p>
              Livora exists to end that. We are a full-service dental clinic staffed 24 hours a day, every day of
              the year, offering everything from a routine scale-and-polish to implants and orthodontics. Nothing
              here is a satellite service: the dentist who examines you is the dentist who treats you, in the same
              building, with the same records in front of them.
            </p>
            <p>
              Just as importantly, we made a rule about money. Nobody at Livora begins a treatment you have not
              been quoted for. If the plan changes halfway through, we stop, explain, and let you decide.
            </p>
          </div>
        </div>
      </Section>

      {/* What we promise */}
      <Section bg="sand">
        <SectionHead eyebrow="What we promise" title="Four things you can hold us to" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-s3">
          {PROMISES.map(([img, title, body]) => (
            <ImageCard key={title} image={img} alt={title} title={title} body={body} />
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section id="team">
        <SectionHead
          eyebrow="Our team"
          title="The people who will<br>be looking after you"
          lead="Registered, experienced and genuinely good with anxious patients, because most of the people who walk through our door are exactly that."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-s3">
          {team.map((t) => (
            <article key={t.id}>
              <div className="rounded-[18px] overflow-hidden aspect-[4/5] bg-sand mb-s3">
                {t.photoUrl && (
                  <img src={t.photoUrl} alt={`Portrait of ${t.name}`} className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>
              <p className="text-[0.8rem] font-bold uppercase tracking-[0.1em] text-cyan-700 mb-1.5">{t.role}</p>
              <h3 className="text-[1.22rem] mb-2">{t.name}</h3>
              <p className="text-[0.93rem] text-muted">{t.bio}</p>
              <p className="text-[0.82rem] font-semibold text-ink pt-2.5 mt-2.5 border-t border-line">{t.credentials}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* Technology */}
      <Section bg="ink" id="technology">
        <div className="flex flex-wrap items-center gap-s5">
          <div className="flex-1 min-w-[320px]">
            <span className="eyebrow eyebrow--light">Technology &amp; facilities</span>
            <h2 className="text-white">Equipment that makes treatment quicker and kinder</h2>
            <p className="lead text-[#A9C6CF]">
              We would rather spend money on the machines that shorten your appointment than on the waiting-room
              furniture.
            </p>
            <ul className="checklist">
              <li>Digital X-ray — up to 80% less radiation, instant images</li>
              <li>Intraoral camera so you can see your own teeth on screen</li>
              <li>Ultrasonic scaler for faster, gentler cleaning</li>
              <li>Topical gel and slow-delivery injections — barely-felt anaesthetic</li>
              <li>Autoclave sterilisation with logged cycles on every shift</li>
              <li>Backup power, so a load-shedding hour never stops a procedure</li>
            </ul>
          </div>
          <div className="flex-1 min-w-[320px]">
            <div className="grid grid-cols-2 gap-s2">
              {TECH_IMAGES.map(([img, alt]) => (
                <div key={img} className="rounded-[18px] overflow-hidden aspect-[4/3] bg-sand">
                  <img src={img} alt={alt} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Accreditation placeholder */}
      <Section bg="sand" id="accreditation">
        <SectionHead
          eyebrow="Registration & accreditation"
          title="Registered, inspected, accountable"
          lead="Our clinicians and our premises are registered with the relevant Zambian authorities. Certificates are displayed at reception and available on request."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-s3">
          {['Health Professions Council of Zambia', 'NHIMA Accredited Provider', 'Dental Association of Zambia', 'Your next certification'].map((t) => (
            <div key={t} className="flex flex-col items-center justify-center min-h-[132px] p-s3 border-2 border-dashed border-[#C6D9DF] rounded-xl bg-sand text-center">
              <strong className="text-[0.92rem] font-bold text-ink">{t}</strong>
              <span className="text-[0.78rem] text-muted mt-1">Badge — to be added</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Gallery */}
      <Section>
        <SectionHead eyebrow="Inside Livora" title="Have a look around" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-s3">
          {GALLERY.map(([img, alt]) => (
            <div key={img} className="rounded-[18px] overflow-hidden aspect-[4/3] bg-sand group">
              <img src={img} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" loading="lazy" />
            </div>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
