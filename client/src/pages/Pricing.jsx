import Seo from '../components/Seo.jsx';
import Section from '../components/ui/Section.jsx';
import SectionHead from '../components/ui/SectionHead.jsx';
import PageHero from '../components/ui/PageHero.jsx';
import PriceBlock from '../components/ui/PriceBlock.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import CtaBand from '../components/ui/CtaBand.jsx';
import { IconShield, IconTooth, IconSparkle, IconBraces, IconCrown, IconBolt } from '../components/ui/icons.jsx';

const BLOCKS = [
  {
    icon: IconShield,
    title: 'General & preventive',
    rows: [
      ['Consultation &amp; full examination', 'from K350'],
      ['Digital X-ray (per image)', 'from K180'],
      ['Scaling &amp; polishing', 'from K650'],
      ['Deep cleaning (per quadrant)', 'from K850'],
      ['Fluoride application', 'from K250'],
      ['Fissure sealant (per tooth)', 'from K300'],
    ],
  },
  {
    icon: IconTooth,
    title: 'Restorative',
    rows: [
      ['Composite filling (small)', 'from K750'],
      ['Composite filling (large)', 'from K1,100'],
      ['Root canal — front tooth', 'from K2,200'],
      ['Root canal — molar', 'from K3,400'],
      ['Porcelain crown', 'from K3,500'],
      ['Bridge (per unit)', 'from K3,200'],
      ['Simple extraction', 'from K500'],
      ['Surgical / wisdom tooth extraction', 'from K1,400'],
    ],
  },
  {
    icon: IconSparkle,
    title: 'Cosmetic',
    rows: [
      ['In-clinic teeth whitening', 'from K2,500'],
      ['Take-home whitening kit', 'from K1,600'],
      ['Porcelain veneer (per tooth)', 'from K3,200'],
      ['Composite bonding (per tooth)', 'from K900'],
      ['Smile makeover consultation', 'from K500'],
    ],
  },
  {
    icon: IconBraces,
    title: 'Orthodontics',
    rows: [
      ['Orthodontic consultation &amp; assessment', 'from K600'],
      ['Metal braces (full treatment)', 'from K18,000'],
      ['Ceramic braces (full treatment)', 'from K24,000'],
      ['Clear aligners (full treatment)', 'from K25,000'],
      ['Retainers (per arch)', 'from K1,800'],
    ],
    note: 'Orthodontic treatment is always quoted as a complete package after assessment, and can be paid monthly across the treatment period.',
  },
  {
    icon: IconCrown,
    title: 'Implants & dentures',
    rows: [
      ['Implant consultation &amp; planning', 'from K700'],
      ['Single implant with crown', 'from K14,500'],
      ['Bone graft', 'from K4,500'],
      ['Partial denture', 'from K3,800'],
      ['Full denture (per arch)', 'from K6,500'],
    ],
  },
  {
    icon: IconBolt,
    title: 'Children & emergency',
    rows: [
      ['Child check-up (under 12)', 'from K250'],
      ['Child filling', 'from K550'],
      ['Child extraction', 'from K400'],
      ['Emergency exam (daytime)', 'from K400'],
      ['Emergency exam (after hours)', 'from K600'],
      ['Pain relief &amp; temporary dressing', 'from K450'],
    ],
  },
];

const FAQS = [
  { q: 'Why are all the prices &ldquo;from&rdquo;?', a: 'Because teeth are not identical. A small filling on a front tooth and a deep one on a back molar take different amounts of time and material. The starting price tells you the realistic floor; your written quote after examination tells you the actual number, and that number does not move.' },
  { q: 'Will you tell me the price before you start?', a: 'Always. Nobody at Livora begins a treatment you have not been quoted for and agreed to. If we discover something mid-treatment that changes the plan, we stop, explain it, and let you decide before continuing.' },
  { q: 'Can I pay in instalments?', a: 'For larger treatments — orthodontics, implants, full-mouth restorative work — yes. We will agree a schedule with you before treatment begins. Ask at reception or mention it when you book.' },
  { q: 'Do you charge more at night?', a: 'Only the emergency examination fee is higher outside normal hours, to cover on-call staffing. The treatment itself costs the same at 3am as it does at 3pm.' },
  { q: 'Can I pay in US dollars?', a: 'Our prices are set in Kwacha. If you need a USD equivalent for an insurer or employer, ask and we will provide one at the prevailing rate on the day of your quote.' },
];

const PAYMENTS = [
  ['Card', 'Visa and Mastercard accepted at reception.'],
  ['Mobile money', 'Airtel Money and MTN Mobile Money.'],
  ['Cash', 'Paid at reception, receipt issued on the spot.'],
  ['Payment plans', 'Larger treatments can be split into instalments.'],
];

export default function Pricing() {
  return (
    <>
      <Seo
        title="Dental Prices in Lusaka | NHIMA Accepted | Livora Dental Clinic"
        description="Transparent dental prices in Kwacha at Livora Dental Clinic, Lusaka. Check-ups from K350, fillings from K750, crowns from K3,500. NHIMA accepted."
        path="/pricing"
      />

      <PageHero image="/img/livora-consultation-room.jpg" crumb="Pricing" title="Prices you see<br>before you sit down" lead="Every figure below is a starting price in Zambian Kwacha. Your exact quote is confirmed in writing after your examination, and it does not change once you have agreed to it." />

      <Section>
        <SectionHead eyebrow="Treatment prices" title="What treatment costs<br>at Livora" />
        <div className="grid md:grid-cols-2 gap-s3">
          {BLOCKS.map((b) => (
            <PriceBlock key={b.title} {...b} />
          ))}
        </div>
        <p className="text-center text-[0.85rem] text-muted mt-s5 max-w-[780px] mx-auto">
          All prices are in Zambian Kwacha (ZMW) and are starting prices, shown as a guide only. Treatment
          complexity varies, so your final quote is confirmed in writing after examination. Approximate USD
          equivalents can be provided on request.
        </p>
      </Section>

      <Section bg="sand" id="nhima">
        <div className="flex flex-wrap items-center gap-s5">
          <div className="flex-1 min-w-[320px]">
            <span className="eyebrow">Insurance</span>
            <h2>We accept NHIMA</h2>
            <p className="lead text-muted">
              Livora is set up to treat NHIMA members. Bring your NHIMA card and your national registration card to
              your appointment and our front desk handles the rest.
            </p>
            <ul className="checklist">
              <li>Cover is confirmed <strong>before</strong> treatment, not after</li>
              <li>You are told exactly what NHIMA covers and what you would pay yourself</li>
              <li>NHIMA applies to emergency visits too, at any hour</li>
              <li>Bring your card and NRC — without them we cannot claim on your behalf</li>
            </ul>
            <p className="text-[0.85rem] text-muted mt-s3">
              Cover levels are set by NHIMA and can change. We will always confirm your current entitlement on the
              day rather than assume it.
            </p>
          </div>
          <div className="flex-1 min-w-[320px]">
            <div className="grid grid-cols-2 gap-s2">
              {PAYMENTS.map(([t, b]) => (
                <div key={t} className="bg-white rounded-[18px] p-s3">
                  <h3 className="text-[1.05rem]">{t}</h3>
                  <p className="text-[0.9rem] text-muted">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-[860px] mx-auto">
          <SectionHead eyebrow="Money questions" title="Frequently asked" />
          <Accordion items={FAQS} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
