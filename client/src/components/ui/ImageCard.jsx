import { Link } from 'react-router-dom';

/**
 * The image-led card used across "What we do", "Our technology", "What we
 * promise", and the emergency symptom grid — .card--media in the source CSS.
 */
export default function ImageCard({ image, alt, title, body, items, linkText, linkHref, dark = false }) {
  return (
    <article className={`card--media flex flex-col h-full rounded-[18px] overflow-hidden border ${dark ? 'bg-ink-800 border-transparent' : 'bg-white border-line'}`}>
      <div className="card-media">
        <img src={image} alt={alt} loading="lazy" />
      </div>
      <div className="flex flex-col flex-1 p-s4">
        <h3 className={`text-[25.6px] font-bold mb-[10px] ${dark ? 'text-white' : 'text-ink'}`}>{title}</h3>
        <p className={`text-[15.36px] leading-[1.7] ${dark ? 'text-[#9FBFC9]' : 'text-muted'} ${items ? 'mb-0' : ''}`}>
          {body}
        </p>
        {items && (
          <ul className="card-list">
            {items.map((i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: i }} />
            ))}
          </ul>
        )}
        {linkHref && (
          <Link to={linkHref} className="inline-flex items-center gap-2 text-[14.72px] font-bold text-cyan-700 hover:text-coral-600 mt-auto pt-s3 group">
            {linkText}
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        )}
      </div>
    </article>
  );
}
