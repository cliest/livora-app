export default function SectionHead({ eyebrow, title, lead, center = true, light = false, className = '' }) {
  return (
    <div className={`max-w-[720px] mb-s6 ${center ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && (
        <span className={`eyebrow ${center ? 'justify-center' : ''} ${light ? 'eyebrow--light' : ''}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={light ? 'text-white' : ''} dangerouslySetInnerHTML={{ __html: title }} />
      {lead && <p className={`lead mt-s3 ${light ? 'text-[#A9C6CF]' : 'text-muted'} text-[1.16rem] leading-[1.75]`}>{lead}</p>}
    </div>
  );
}
