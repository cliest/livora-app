import { IconStar } from './icons.jsx';

export default function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-[3px] mb-s2" role="img" aria-label={`Rated ${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <IconStar key={i} className="w-[17px] h-[17px] text-gold" />
      ))}
    </div>
  );
}
