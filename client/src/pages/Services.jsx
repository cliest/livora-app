import Seo from '../components/Seo.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import ServiceRow from '../components/ui/ServiceRow.jsx';
import EmergencyBand from '../components/ui/EmergencyBand.jsx';
import CtaBand from '../components/ui/CtaBand.jsx';

const JUMP_LINKS = [
  ['#general', 'Check-ups', 'white'],
  ['#restorative', 'Restorative', 'ghost'],
  ['#cosmetic', 'Cosmetic', 'ghost'],
  ['#orthodontics', 'Braces', 'ghost'],
  ['#implants', 'Implants', 'ghost'],
  ['#children', 'Children', 'ghost'],
];

const SERVICES = [
  {
    id: 'general',
    eyebrow: 'General & preventive',
    title: 'Check-ups, cleaning and keeping problems small',
    lead: 'The cheapest dentistry you will ever pay for is the appointment that catches a problem early. A Livora check-up is a full examination, not a glance and a goodbye.',
    items: [
      '<strong>Full dental examination</strong> — teeth, gums, bite and soft tissue, with digital X-rays where needed',
      '<strong>Scaling and polishing</strong> to remove the hardened plaque a toothbrush cannot reach',
      '<strong>Gum disease treatment</strong>, including deep cleaning below the gum line',
      '<strong>Fluoride application and fissure sealants</strong> to protect at-risk teeth',
      '<strong>A written report</strong> in plain language, telling you what needs doing now and what can wait',
    ],
    image: '/img/dental-cleaning-treatment.jpg',
    alt: 'A dental hygienist performing a professional scaling and polishing',
  },
  {
    id: 'restorative',
    eyebrow: 'Restorative dentistry',
    title: 'Repairing damage, saving teeth',
    lead: 'A tooth that hurts can almost always be saved if you reach us in time. These are the treatments that get you out of pain and back to chewing normally.',
    items: [
      '<strong>Composite fillings</strong> matched to your tooth colour, usually completed in one visit',
      '<strong>Root canal treatment</strong> to save a badly infected tooth instead of extracting it',
      '<strong>Crowns</strong> that rebuild a cracked or heavily filled tooth to full strength',
      '<strong>Bridges and dentures</strong> to replace missing teeth and restore your bite',
      '<strong>Extractions</strong>, including surgical removal of wisdom teeth, under proper anaesthetic',
    ],
    image: '/img/tooth-decay-examination.jpg',
    alt: 'Close-up of a tooth being examined before a composite filling',
    reverse: true,
    sand: true,
  },
  {
    id: 'cosmetic',
    eyebrow: 'Cosmetic dentistry',
    title: 'The smile you stop hiding',
    lead: 'Cosmetic work at Livora starts with a healthy mouth — we will not whiten over decay. Once the foundation is right, the aesthetic results are dramatic.',
    items: [
      '<strong>Professional teeth whitening</strong>, safe on enamel and far stronger than anything over the counter',
      '<strong>Porcelain veneers</strong> for chipped, stained, gapped or uneven front teeth',
      '<strong>Composite bonding</strong> to reshape a single tooth in one appointment',
      '<strong>Smile makeover planning</strong>, where we map the full result before any work begins',
      '<strong>Gum contouring</strong> to even out a gummy or uneven smile line',
    ],
    image: '/img/patient-smiling-portrait.jpg',
    alt: 'A patient smiling confidently after cosmetic dental treatment',
  },
  {
    id: 'orthodontics',
    eyebrow: 'Orthodontics',
    title: 'Straightening teeth, at any age',
    lead: 'Crowded, gapped or crooked teeth are harder to clean, which makes them more likely to decay. Straightening them is a health decision as much as a cosmetic one.',
    items: [
      '<strong>Traditional metal braces</strong> — the most reliable option for complex cases',
      '<strong>Ceramic braces</strong> that blend into the tooth for a far less visible look',
      '<strong>Clear aligners</strong>, removable and near-invisible, for suitable cases',
      '<strong>Retainers</strong> to hold the result once the braces come off',
      '<strong>A full timeline and total cost</strong> agreed at your first orthodontic consultation',
    ],
    image: '/img/orthodontics-braces-treatment.jpg',
    alt: "Orthodontic braces fitted to straighten a patient's teeth",
    reverse: true,
    sand: true,
  },
  {
    id: 'implants',
    eyebrow: 'Dental implants',
    title: 'A replacement tooth that behaves like a real one',
    lead: 'A bridge sits on top of your gum. An implant is anchored into the jawbone, so it bites, brushes and lasts like the tooth it replaced, and it stops the bone shrinking where the tooth was lost.',
    items: [
      '<strong>Single tooth implants</strong> with a crown matched to your natural shade',
      '<strong>Multiple implants</strong> and implant-supported bridges for larger gaps',
      '<strong>Implant-retained dentures</strong> that clip firmly into place instead of slipping',
      '<strong>Bone grafting</strong> where the jaw needs building up first',
      '<strong>A staged plan with staged payments</strong> — you are never asked for it all at once',
    ],
    image: '/img/dentist-at-work.jpg',
    alt: 'A Livora dentist carrying out implant treatment',
  },
  {
    id: 'children',
    eyebrow: "Children's dentistry",
    title: 'Their first dentist should not be a bad memory',
    lead: 'How a child feels about their first few visits usually decides whether they look after their teeth as an adult. We take that seriously, and we take our time.',
    items: [
      '<strong>First visits from the age of one</strong>, or as soon as the first teeth appear',
      '<strong>Check-ups, fluoride and sealants</strong> to prevent decay before it starts',
      '<strong>Gentle fillings and extractions</strong> for baby teeth, explained at their level',
      '<strong>Brushing coaching</strong> for children and parents together',
      '<strong>Early orthodontic assessment</strong> to catch bite problems while they are simple to fix',
    ],
    image: '/img/child-dental-visit.jpg',
    alt: 'A young girl sitting comfortably in the chair for a dental check-up',
    reverse: true,
    sand: true,
  },
];

export default function Services() {
  return (
    <>
      <Seo
        title="Dental Services in Livingstone | Check-ups, Implants, Braces | Livora"
        description="Complete dental care in Livingstone: check-ups and cleaning, fillings, root canals, crowns, implants, braces, clear aligners, whitening and children's dentistry. NHIMA accepted, open 24/7."
        path="/services"
      />

      <PageHero
        image="/img/dental-checkup-patient.jpg"
        crumb="Services"
        title="Every treatment,<br>under one roof"
        lead="From a six-month check-up to a full smile rebuild. Whatever you need, it happens here, with the same team and the same records, and you will never be sent across town mid-treatment."
      >
        <div className="flex flex-wrap gap-2 mt-s4">
          {JUMP_LINKS.map(([href, label, style]) => (
            <a key={href} href={href} className={`btn btn--sm ${style === 'white' ? 'btn--white' : 'btn--ghost-light'}`}>
              {label}
            </a>
          ))}
        </div>
      </PageHero>

      {SERVICES.map((s) => (
        <ServiceRow key={s.id} {...s} />
      ))}

      <section className="py-s6">
        <div className="container">
          <EmergencyBand
            eyebrow="Emergency dentistry"
            title="Pain does not wait,<br>and neither do we"
            body="Severe toothache, a knocked-out or broken tooth, an abscess, facial swelling, a lost filling or crown, bleeding that will not stop. Call us at any hour and we will see you the same day."
            secondaryLabel="Emergency dental care"
            secondaryHref="/emergency"
            wrap={false}
          />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
