export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-s3 text-[0.85rem] text-muted">
      <span>
        Page {page} of {totalPages} ({total} total)
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="btn btn--outline btn--sm disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="btn btn--outline btn--sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
