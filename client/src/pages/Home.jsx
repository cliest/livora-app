import Seo from '../components/Seo.jsx';
import Section from '../components/ui/Section.jsx';
import SectionHead from '../components/ui/SectionHead.jsx';
import ImageCard from '../components/ui/ImageCard.jsx';
import IconBox from '../components/ui/IconBox.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import StarRating from '../components/ui/StarRating.jsx';
import PhoneIcon from '../components/layout/PhoneIcon.jsx';
import { IconClock, IconShield, IconXray, IconBolt, IconCamera, IconPriceTag } from '../components/ui/icons.jsx';

const PROOF = [
  ['24/7', 'Always open'],
  ['NHIMA', 'Accepted here'],
  ['15+', 'Treatments offered'],
  ['Same day', 'Emergency slots'],
];

const WHY = [
  {
    n: '01',
    title: 'Closed when you need them most',
    body: 'Toothache does not keep office hours. Livora is staffed <strong>24 hours a day, 7 days a week</strong> — Christmas Day included. You call, someone answers, and you are seen.',
  },
  {
    n: '02',
    title: 'Referring you somewhere else',
    body: 'Cleaning, root canals, implants, braces, surgery, kids\' dentistry — all under one roof. No being sent across town mid-treatment, no starting your story over with a new dentist.',
  },
  {
    n: '03',
    title: 'A bill you did not expect',
    body: 'You get a written quote before any treatment starts. If the plan changes, we stop and talk to you first. NHIMA is accepted and payment plans are available.',
  },
];

const SERVICE_CARDS = [
  {
    image: '/img/tooth-decay-examination.jpg',
    alt: 'A bright, healthy smile being checked with a dental mirror',
    title: 'Everyday Care',
    body: 'The routine appointments that stop small problems becoming expensive ones.',
    items: ['Check-ups &amp; examinations', 'Scaling &amp; polishing', 'Fillings', "Children's dentistry"],
    linkText: 'Everyday care',
    linkHref: '/services#general',
  },
  {
    image: '/img/dental-cleaning-treatment.jpg',
    alt: 'A dentist repairing a damaged tooth during restorative treatment',
    title: 'Repair & Restore',
    body: 'When a tooth is damaged, infected or missing, these are the treatments that fix it.',
    items: ['Root canal treatment', 'Crowns &amp; bridges', 'Dental implants', 'Extractions'],
    linkText: 'Repair & restore',
    linkHref: '/services#restorative',
  },
  {
    image: '/img/patient-smiling-portrait.jpg',
    alt: 'A patient smiling confidently after cosmetic dental treatment',
    title: 'Straighten & Whiten',
    body: 'Cosmetic and orthodontic work, always built on a healthy mouth first.',
    items: ['Braces &amp; clear aligners', 'Teeth whitening', 'Porcelain veneers', 'Smile makeovers'],
    linkText: 'Straighten & whiten',
    linkHref: '/services#cosmetic',
  },
];

const TECH_CARDS = [
  {
    image: '/img/digital-dental-xray.jpg',
    alt: 'Dentist reviewing digital dental X-ray images',
    title: 'Digital X-ray',
    body: 'Up to 80% less radiation than film, and the image is on screen in seconds so we can show you exactly what we are looking at.',
  },
  {
    image: '/img/dentist-screen-explain.jpg',
    alt: "A dentist showing a patient their scan on a treatment room screen",
    title: 'Intraoral Camera',
    body: 'A pen-sized camera puts your own teeth on the monitor. You see the problem yourself instead of taking our word for it.',
  },
  {
    image: '/img/dental-checkup-patient.jpg',
    alt: 'A dental team carrying out gentle, carefully anaesthetised treatment',
    title: 'Painless Anaesthetic',
    body: 'Topical gel before the injection and a slow delivery technique, so the part everybody dreads is barely noticeable.',
  },
  {
    image: '/img/sterilised-instruments.jpg',
    alt: 'A row of sterilised dental instruments ready for use',
    title: 'Hospital-Grade Sterilisation',
    body: 'Autoclaved instruments, sealed pouches and single-use items. Infection control is checked and logged on every shift.',
  },
];

// PLACEHOLDER — written to show the layout, not real patient reviews.
// Replace with genuine quotes (with permission) or wire up live Google reviews.
const TESTIMONIALS = [
  {
    quote:
      'I woke up at 2am with a molar that felt like it was on fire. I called expecting an answering machine and a human picked up. I was in the chair by 3:15 and home again before sunrise.',
    name: 'Mwape C.',
    role: 'Emergency root canal',
  },
  {
    quote:
      'I had avoided dentists for eleven years out of pure fear. They let me sit in the chair for ten minutes without touching anything, just talking. That mattered more than I can explain.',
    name: 'Grace N.',
    role: 'Check-up & deep clean',
  },
  {
    quote:
      'They quoted me for the crown before starting and the final bill was exactly that number. After my last experience elsewhere, being told the price up front was the whole reason I came back.',
    name: 'Joseph M.',
    role: 'Crown & filling',
  },
];

// PLACEHOLDER prices — indicative only, confirm against the real fee schedule.
const PRICES = [
  ['Consultation & full examination', 'from K350'],
  ['Scaling & polishing', 'from K650'],
  ['Composite filling', 'from K750'],
  ['Root canal treatment', 'from K2,200'],
  ['Porcelain crown', 'from K3,500'],
  ['Teeth whitening', 'from K2,500'],
];

const FAQS = [
  {
    q: 'Are you really open 24 hours?',
    a: 'Yes. Livora is staffed around the clock, seven days a week, including public holidays. There is always a qualified dentist on duty. For non-urgent treatment we will usually book you into a scheduled slot, but if you are in pain you will be seen straight away.',
  },
  {
    q: 'Do you accept NHIMA?',
    a: 'We do. Bring your NHIMA card and national registration card to your appointment and our front desk will handle the paperwork. Cover varies by treatment, so we will always tell you what is covered and what you would pay yourself before we begin. We also take cash, card and mobile money.',
  },
  {
    q: 'I am terrified of the dentist. Can you help?',
    a: 'This is more common than you think, and it is never something we rush. Tell us when you book and we will give you a longer appointment, walk you through every step before it happens, and agree a hand signal so you can stop us at any moment.',
  },
  {
    q: 'How often should I have a check-up?',
    a: 'For most adults, every six months. If you smoke, have gum disease, wear braces or have a history of decay, we may suggest every three to four months. Children should be seen from the time their first teeth come through.',
  },
  {
    q: 'What should I do about a toothache tonight?',
    a: 'Rinse with warm salt water, take the painkiller you would normally use, and hold a cold compress against your cheek. Do not put aspirin directly on the gum — it burns the tissue. Then call us. See our <a href="/emergency" class="underline">emergency dental page</a> for more.',
  },
];

export default function Home() {
  return (
    <>
      <Seo
        title="Dentist in Lusaka | 24/7 Emergency Dental Care | Livora Dental Clinic"
        description="Livora is a professional dental clinic in Lusaka, Zambia, open 24 hours a day. Check-ups, cleaning, fillings, implants, braces and emergency toothache care. NHIMA accepted."
        path="/"
      />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden isolate bg-ink">
        <div
          className="absolute inset-0 bg-cover bg-[72%_center] animate-kenburns"
          style={{ backgroundImage: "url('/img/hero-confident-smile.jpg')" }}
          role="img"
          aria-label="A woman smiling confidently after dental treatment at Livora Dental Clinic"
        />
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(100deg, rgba(10,42,51,.96) 0%, rgba(10,42,51,.88) 38%, rgba(10,42,51,.45) 66%, rgba(10,42,51,.22) 100%)',
          }}
        />
        <div className="container relative z-[2]">
          <div className="max-w-[660px] py-[148px_156px] pt-[148px] pb-[156px] max-[1024px]:pt-[104px] max-[1024px]:pb-[112px] max-[767px]:pt-[76px] max-[767px]:pb-[84px]">
            <span className="inline-flex items-center gap-[10px] bg-white/10 border border-white/20 pl-[14px] pr-[18px] py-[9px] rounded-full text-[0.8rem] font-bold uppercase tracking-[0.06em] text-white mb-s3">
              <span className="pulse-dot" />
              Open 24 hours &mdash; walk in any time
            </span>
            <h1 className="text-white mb-s3">
              The dentist Lusaka
              <br />
              can call at <span className="text-cyan">3am.</span>
            </h1>
            <p className="text-[#C6DCE3] text-[1.2rem] max-w-[540px]">
              Livora is a professional dental clinic built around one idea: nobody should sit through the night with
              a toothache. Full general, cosmetic and emergency dental care, every day of the year.
            </p>
            <div className="flex flex-wrap gap-s2 mt-s4">
              <a href="/book" className="btn btn--primary btn--lg">
                Book an Appointment
              </a>
              <a href="tel:+260760737805" className="btn btn--ghost-light btn--lg">
                <PhoneIcon />
                Call Now
              </a>
            </div>
            <div className="flex flex-wrap gap-s4 mt-s5 pt-s4 border-t border-white/[.18]">
              {PROOF.map(([n, l]) => (
                <div key={l}>
                  <strong className="block text-[1.55rem] font-extrabold text-white leading-[1.2]">{n}</strong>
                  <span className="text-[0.84rem] text-[#9FBFC9]">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="bg-ink-800 py-s4">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-s3">
            {[
              [IconClock, 'Open 24 hours', 'Including weekends & holidays'],
              [IconShield, 'NHIMA accepted', 'Plus cash, card & mobile money'],
              [IconXray, 'Digital X-ray', 'Lower dose, instant results'],
              [IconBolt, 'Prices up front', 'Quoted before we begin'],
            ].map(([Icon, t, s]) => (
              <div key={t} className="flex items-center gap-[14px]">
                <Icon className="w-[26px] h-[26px] text-cyan flex-none" />
                <div>
                  <strong className="block text-white text-[0.98rem] font-bold leading-[1.3]">{t}</strong>
                  <span className="text-[0.82rem] text-[#8FB2BD]">{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY LIVORA ============ */}
      <Section>
        <SectionHead
          eyebrow="Why patients choose Livora"
          title="Three things every other clinic<br>asks you to <span class='underline-brush'>put up with.</span>"
          lead="We built Livora by looking at what frustrates people about going to the dentist in Zambia, and removing it."
        />
        <div className="grid md:grid-cols-3 gap-s4">
          {WHY.map((w) => (
            <div key={w.n} className="relative pt-s5">
              <span className="absolute -top-1.5 left-0 text-[4.2rem] font-black leading-none text-cyan/[.14] tracking-[-0.04em]">
                {w.n}
              </span>
              <h3 className="relative">{w.title}</h3>
              <p className="text-muted" dangerouslySetInnerHTML={{ __html: w.body }} />
            </div>
          ))}
        </div>
      </Section>

      {/* ============ SERVICES (3 cards) ============ */}
      <Section bg="sand">
        <SectionHead
          eyebrow="What we do"
          title="Complete dental care,<br>all in one place"
          lead="From a routine clean to a full smile rebuild, delivered by dentists who do this every day."
        />
        <div className="grid md:grid-cols-3 gap-s3">
          {SERVICE_CARDS.map((c) => (
            <ImageCard key={c.title} {...c} />
          ))}
        </div>
        <div className="text-center mt-s5">
          <a href="/services" className="btn btn--ink btn--lg">
            See all 15+ treatments &amp; prices
          </a>
        </div>
      </Section>

      {/* ============ EMERGENCY BAND ============ */}
      <Section size="xs">
        <div
          className="rounded-[28px] p-s6 max-[767px]:p-s4"
          style={{ background: 'linear-gradient(115deg, #E9897E 0%, #D96A5D 100%)' }}
        >
          <div className="flex flex-wrap items-center gap-s4">
            <div className="flex-1 min-w-[280px]">
              <span className="eyebrow" style={{ color: '#fff' }}>
                Dental emergency
              </span>
              <h2 className="text-white mb-s3">
                In pain right now?
                <br />
                Do not wait until morning.
              </h2>
              <p className="text-white/[.93] text-[1.16rem] leading-[1.75]">
                Severe toothache, a knocked-out tooth, a broken filling, facial swelling or bleeding that will not
                stop. Call us and we will see you today. There is always a dentist on duty at Livora.
              </p>
            </div>
            <div className="flex-1 min-w-[260px]">
              <div className="flex flex-wrap gap-s2">
                <a href="tel:+260760737805" className="btn btn--white btn--lg">
                  <PhoneIcon />
                  Call +260 76 073 7805
                </a>
                <a href="/emergency" className="btn btn--ghost-light btn--lg">
                  What counts as an emergency?
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ ABOUT TEASER ============ */}
      <Section>
        <div className="flex flex-wrap items-center gap-s5">
          <div className="flex-1 min-w-[320px]">
            <div className="relative">
              <div className="absolute -inset-x-[22px] -bottom-[22px] w-[58%] h-[58%] rounded-[28px] bg-sand-deep -z-10 max-[1024px]:hidden" />
              <img
                src="/img/dentist-at-work.jpg"
                alt="A Livora dentist carrying out a check-up on a patient in the treatment room"
                className="rounded-[28px] w-full"
              />
              <div className="absolute right-0 -bottom-[22px] max-[1024px]:static max-[1024px]:mt-s3 bg-white rounded-[18px] shadow-lg px-s4 py-s3 max-w-[220px]">
                <strong className="block text-[2rem] font-extrabold text-cyan leading-[1.1]">24/7</strong>
                <span className="text-[0.85rem] font-semibold text-muted">
                  A dentist on duty, every hour of every day
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-[320px]">
            <span className="eyebrow">About Livora</span>
            <h2>A clinic that treats you like a person, not an appointment slot</h2>
            <p className="lead text-muted">
              Livora Dental Clinic exists because too many people in Zambia put off dental treatment until it
              becomes an emergency. Our answer was simple: stay open, explain everything, and quote the price
              before we pick up an instrument.
            </p>
            <ul className="checklist">
              <li>Qualified, registered dentists and hygienists on every shift</li>
              <li>Modern equipment including digital X-ray and intraoral scanning</li>
              <li>Strict sterilisation and single-use instruments where required</li>
              <li>Unhurried appointments — we build in time for questions</li>
              <li>Special care for nervous patients and first-time visitors</li>
            </ul>
            <div className="flex flex-wrap gap-s2 mt-s4">
              <a href="/about" className="btn btn--primary">
                More about us
              </a>
              <a href="/about#team" className="btn btn--outline">
                Meet the team
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ TECHNOLOGY ============ */}
      <Section bg="ink">
        <SectionHead
          eyebrow="Our technology"
          title="Better equipment means<br>less time in the chair"
          lead="The tools we invested in are the ones that make treatment faster, more accurate and more comfortable for you."
          light
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-s3">
          {TECH_CARDS.map((c) => (
            <ImageCard key={c.title} {...c} dark />
          ))}
        </div>
      </Section>

      {/* ============ TESTIMONIALS ============ */}
      <Section bg="sand">
        <SectionHead
          eyebrow="Patient stories"
          title="What people say after<br>their first visit"
        />
        <div className="grid md:grid-cols-3 gap-s3">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="relative flex flex-col bg-white border border-line rounded-[18px] p-s4"
            >
              <span className="absolute top-3 right-[26px] text-[5rem] leading-none font-extrabold text-cyan/[.12] select-none">
                &ldquo;
              </span>
              <StarRating />
              <blockquote className="mb-s3 text-[1rem] leading-[1.75] text-ink">{t.quote}</blockquote>
              <div className="flex items-center gap-[13px] mt-auto">
                <span className="flex items-center justify-center w-[46px] h-[46px] rounded-full bg-sand-deep text-cyan-700 font-extrabold text-base flex-none">
                  {t.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </span>
                <div>
                  <strong className="block text-[0.95rem] font-bold">{t.name}</strong>
                  <span className="text-[0.84rem] text-muted">{t.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="text-center text-[0.82rem] text-muted mt-s4">
          Sample reviews shown while we collect real patient testimonials.
        </p>
      </Section>

      {/* ============ PRICING TEASER ============ */}
      <Section>
        <div className="flex flex-wrap items-center gap-s5">
          <div className="flex-1 min-w-[320px]">
            <span className="eyebrow">Straightforward pricing</span>
            <h2>
              You will know the cost
              <br />
              before we start
            </h2>
            <p className="lead text-muted">
              No estimates that quietly double. Every treatment plan is written down and priced in Kwacha before you
              agree to anything. We accept <strong>NHIMA</strong>, cash, card and mobile money, and larger
              treatments can be split into instalments.
            </p>
            <div className="flex flex-wrap gap-s2 mt-s4">
              <a href="/pricing" className="btn btn--primary">
                See the full price list
              </a>
              <a href="/book" className="btn btn--outline">
                Book a consultation
              </a>
            </div>
          </div>
          <div className="flex-1 min-w-[320px]">
            <div className="bg-white border border-line rounded-[18px] p-s4">
              <h3 className="flex items-center gap-3 mb-s3">
                <IconPriceTag className="w-[22px] h-[22px] text-cyan flex-none" />
                Popular treatments
              </h3>
              {PRICES.map(([name, price]) => (
                <div key={name} className="flex items-baseline gap-3 py-[13px] border-b border-dashed border-line last:border-0">
                  <span className="text-[0.97rem] font-semibold text-ink">{name}</span>
                  <span className="flex-1 border-b border-dotted border-[#C9D8DD] -translate-y-1" />
                  <span className="text-[0.97rem] font-extrabold text-cyan-700 whitespace-nowrap flex-none">
                    {price}
                  </span>
                </div>
              ))}
              <p className="text-[0.85rem] text-muted mt-s3">
                Prices shown in Zambian Kwacha. Your exact quote depends on your examination — we confirm it in
                writing before treatment begins.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ============ FAQ ============ */}
      <Section bg="sand">
        <div className="flex flex-wrap gap-s5">
          <div className="flex-1 min-w-[280px]">
            <span className="eyebrow">Common questions</span>
            <h2>Before you book</h2>
            <p className="lead mt-s3 text-muted">
              Anything else on your mind? Call us on{' '}
              <a href="tel:+260760737805" className="underline">
                +260 76 073 7805
              </a>{' '}
              — someone is always there.
            </p>
            <a href="/contact" className="btn btn--primary mt-s4">
              Ask us a question
            </a>
          </div>
          <div className="flex-[1.6] min-w-[320px]">
            <Accordion items={FAQS} />
          </div>
        </div>
      </Section>

      {/* ============ FINAL CTA ============ */}
      <Section bg="ink">
        <div className="flex flex-wrap items-center gap-s5">
          <div className="flex-[1.4] min-w-[280px]">
            <span className="eyebrow eyebrow--light">Ready when you are</span>
            <h2 className="text-white mt-s2">
              Book your appointment
              <br />
              at Livora today
            </h2>
            <p className="lead mt-s3 text-[#A9C6CF]">
              Tell us when suits you and what you need. We will confirm by phone within the hour — or immediately,
              if it is urgent.
            </p>
          </div>
          <div className="flex-1 min-w-[260px]">
            <div className="flex flex-wrap gap-s2">
              <a href="/book" className="btn btn--primary btn--lg">
                Book Appointment
              </a>
              <a
                href="https://wa.me/260760737805"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost-light btn--lg"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
