import Seo from '../components/Seo.jsx';
import Section from '../components/ui/Section.jsx';

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found | Livora Dental Clinic" description="This page could not be found." path="/404" noindex />
      <Section>
        <div className="max-w-[560px] mx-auto text-center">
          <h1>Page not found</h1>
          <p className="lead text-muted">
            That page does not exist, or has moved. Try the homepage, or call us if you were looking for something
            specific.
          </p>
          <div className="flex flex-wrap gap-s2 justify-center mt-s4">
            <a href="/" className="btn btn--primary">
              Back to homepage
            </a>
            <a href="tel:+260760737805" className="btn btn--outline">
              Call +260 76 073 7805
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
