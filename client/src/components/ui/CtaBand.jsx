import { Link } from 'react-router-dom';

export default function CtaBand() {
  return (
    <section className="bg-ink py-s8 max-[1024px]:py-s6">
      <div className="container">
        <div className="flex flex-wrap items-center gap-s5">
          <div className="flex-[1.4] min-w-[280px]">
            <span className="eyebrow eyebrow--light">Ready when you are</span>
            <h2 className="text-white mt-s2">
              Book your appointment
              <br />
              at Livora today
            </h2>
            <p className="lead mt-s3 text-[#A9C6CF]">
              Tell us when suits you and what you need. We will confirm by phone within the hour, or immediately, if
              it is urgent.
            </p>
          </div>
          <div className="flex-1 min-w-[260px]">
            <div className="flex flex-wrap gap-s2">
              <Link to="/book" className="btn btn--primary btn--lg">
                Book Appointment
              </Link>
              <a href="tel:+260760737805" className="btn btn--ghost-light btn--lg">
                Call +260 76 073 7805
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
