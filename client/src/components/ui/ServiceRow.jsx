export default function ServiceRow({ id, eyebrow, title, lead, items, image, alt, reverse = false, sand = false }) {
  const media = (
    <div className="flex-1 min-w-[320px]">
      <img src={image} alt={alt} className="rounded-[18px] w-full aspect-[4/3] object-cover" loading="lazy" />
    </div>
  );
  const copy = (
    <div className="flex-1 min-w-[320px]">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p className="lead text-muted">{lead}</p>
      <ul className="checklist">
        {items.map((i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: i }} />
        ))}
      </ul>
      <div className="flex flex-wrap gap-s2 mt-s4">
        <a href="/book" className="btn btn--primary">
          Book this treatment
        </a>
        <a href="/pricing" className="btn btn--outline">
          See prices
        </a>
      </div>
    </div>
  );

  return (
    <section id={id} className={`py-16 max-[1024px]:py-14 max-[767px]:py-12 ${sand ? 'bg-sand' : 'bg-white'}`}>
      <div className="container">
        <div className="flex flex-wrap items-center gap-s5">
          {reverse ? (
            <>
              {copy}
              {media}
            </>
          ) : (
            <>
              {media}
              {copy}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
