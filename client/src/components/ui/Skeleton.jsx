// Loading placeholders shaped like the content they stand in for, so the
// layout doesn't jump when real data arrives. Purely decorative: each group
// is wrapped in a busy region with one screen-reader label instead.

export function Skeleton({ className = '' }) {
  return <span aria-hidden="true" className={`block bg-line motion-safe:animate-skeleton ${className}`} />;
}

export function LoadingRegion({ label = 'Loading', className = '', children }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  );
}

const repeat = (count) => Array.from({ length: count }, (_, i) => i);

// Dotted price rows, as rendered inside PriceBlock and the Home teaser card.
export function PriceRowsSkeleton({ rows = 4 }) {
  return repeat(rows).map((i) => (
    <div key={i} className="flex items-center gap-3 py-[15px] border-b border-dashed border-line last:border-0">
      <Skeleton className={`h-4 ${i % 2 ? 'w-[46%]' : 'w-[58%]'}`} />
      <span className="flex-1" />
      <Skeleton className="h-4 w-[72px]" />
    </div>
  ));
}

export function PriceBlockSkeleton({ rows = 4 }) {
  return (
    <div className="bg-white border border-line rounded-[18px] p-s4 h-full">
      <div className="flex items-center gap-3 mb-s3">
        <Skeleton className="w-[22px] h-[22px]" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <PriceRowsSkeleton rows={rows} />
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-line rounded-[18px] p-s4">
      <Skeleton className="h-4 w-[96px] mb-s3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-s3" />
      <div className="flex items-center gap-[13px] mt-auto">
        <Skeleton className="w-[46px] h-[46px] flex-none" />
        <div className="flex-1">
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function TeamMemberSkeleton() {
  return (
    <div>
      <Skeleton className="rounded-[18px] aspect-[4/5] mb-s3" />
      <Skeleton className="h-3 w-1/3 mb-2" />
      <Skeleton className="h-5 w-2/3 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function BadgeSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 min-h-[132px] p-s3 border border-line rounded-xl bg-white">
      <Skeleton className="w-12 h-12" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// ---- Admin dashboard ---------------------------------------------------

export function TableRowsSkeleton({ columns, rows = 6 }) {
  return repeat(rows).map((r) => (
    <tr key={r} className="border-b border-line last:border-0" aria-hidden="true">
      {repeat(columns).map((c) => (
        <td key={c} className="px-4 py-4">
          <Skeleton className={`h-4 ${c === 0 ? 'w-[120px]' : 'w-[80px]'}`} />
        </td>
      ))}
    </tr>
  ));
}

export function CardListSkeleton({ count = 3 }) {
  return (
    <LoadingRegion className="flex flex-col gap-s2">
      {repeat(count).map((i) => (
        <div key={i} className="bg-white border border-line rounded-[18px] p-s3">
          <Skeleton className="h-5 w-1/3 mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </LoadingRegion>
  );
}

export function FormSkeleton({ fields = 6 }) {
  return (
    <LoadingRegion className="grid gap-s3 max-w-[720px]">
      {repeat(fields).map((i) => (
        <div key={i}>
          <Skeleton className="h-3 w-[120px] mb-2" />
          <Skeleton className="h-[46px] w-full" />
        </div>
      ))}
    </LoadingRegion>
  );
}
