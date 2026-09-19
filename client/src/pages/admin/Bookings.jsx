import { useState, Fragment } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Seo from '../../components/Seo.jsx';
import StatusPill from '../../components/admin/StatusPill.jsx';
import StatusSelect from '../../components/admin/StatusSelect.jsx';
import StatusTabs from '../../components/admin/StatusTabs.jsx';
import SearchInput from '../../components/admin/SearchInput.jsx';
import Pagination from '../../components/admin/Pagination.jsx';
import NotesRow from '../../components/admin/NotesRow.jsx';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import { api } from '../../lib/api.js';

const humanize = (v) => (v ? v.charAt(0) + v.slice(1).toLowerCase().replace(/_/g, ' ') : '—');

export default function AdminBookings() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', status, debouncedSearch, page],
    queryFn: () => api.listBookings({ ...(status ? { status } : {}), ...(debouncedSearch ? { q: debouncedSearch } : {}), page }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status: newStatus }) => api.updateBooking(id, { status: newStatus }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  const updateNotes = useMutation({
    mutationFn: ({ id, staffNotes }) => api.updateBooking(id, { staffNotes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }),
  });

  return (
    <div>
      <Seo title="Bookings | Livora Admin" description="Manage booking requests." path="/admin/bookings" noindex />
      <h1 className="text-[1.6rem] mb-s3">Bookings</h1>

      <SearchInput
        value={search}
        onChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
      />

      <StatusTabs
        value={status}
        onChange={(s) => {
          setStatus(s);
          setPage(1);
        }}
      />

      <div className="bg-white border border-line rounded-[18px] overflow-x-auto">
        <table className="w-full text-[0.88rem]">
          <thead>
            <tr className="border-b border-line text-left text-muted text-[0.78rem] uppercase tracking-[0.04em]">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Preferred</th>
              <th className="px-4 py-3">NHIMA</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={8}>Loading…</td>
              </tr>
            )}
            {!isLoading && data?.items?.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={8}>No bookings found.</td>
              </tr>
            )}
            {data?.items?.map((b) => (
              <Fragment key={b.id}>
                <tr className="border-b border-line last:border-0 align-top">
                  <td className="px-4 py-3 font-semibold text-ink">
                    {b.fullName}
                    {b.email && <span className="block text-muted font-normal text-[0.8rem]">{b.email}</span>}
                  </td>
                  <td className="px-4 py-3">{b.phone}</td>
                  <td className="px-4 py-3">{humanize(b.service)}</td>
                  <td className="px-4 py-3">
                    {new Date(b.preferredDate).toLocaleDateString()}
                    <span className="block text-muted text-[0.8rem]">{humanize(b.preferredTime)}</span>
                  </td>
                  <td className="px-4 py-3">{humanize(b.nhimaMember)}</td>
                  <td className="px-4 py-3 text-muted">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5 items-start">
                      <StatusPill status={b.status} />
                      <StatusSelect
                        value={b.status}
                        disabled={updateStatus.isPending}
                        onChange={(newStatus) => updateStatus.mutate({ id: b.id, status: newStatus })}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                      className="text-[0.82rem] font-semibold text-cyan-700 hover:underline whitespace-nowrap"
                    >
                      {b.staffNotes ? '● Notes' : '+ Notes'}
                      {expandedId === b.id ? ' ▾' : ' ▸'}
                    </button>
                  </td>
                </tr>
                {expandedId === b.id && (
                  <NotesRow
                    colSpan={8}
                    patientMessage={b.message}
                    patientMessageLabel="Anything we should know? (patient's own message)"
                    notes={b.staffNotes}
                    saving={updateNotes.isPending}
                    onSave={(staffNotes) => updateNotes.mutateAsync({ id: b.id, staffNotes })}
                  />
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />}
    </div>
  );
}
