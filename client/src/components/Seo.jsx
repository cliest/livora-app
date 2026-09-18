const SITE = 'https://www.livoradentalclinic.com';
const DEFAULT_IMAGE = `${SITE}/img/hero-confident-smile.jpg`;

/**
 * Per-route SEO. Every page component renders this once with its own
 * title/description — matches the <title>/<meta description> that used to
 * be hand-written into each static HTML file.
 *
 * No react-helmet dependency needed: React 19 natively hoists <title>,
 * <meta> and <link> tags rendered anywhere in the tree up into <head>,
 * de-duplicating by tag+attribute automatically. This also sidesteps
 * react-helmet-async's peer dependency, which only supports React ≤18.
 */
export default function Seo({ title, description, path = '/', image = DEFAULT_IMAGE, noindex = false }) {
  const fullTitle = title.includes('Livora') ? title : `${title} | Livora Dental Clinic`;
  const url = `${SITE}${path}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
