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

export default function AdminMessages() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-messages', status, debouncedSearch, page],
    queryFn: () => api.listMessages({ ...(status ? { status } : {}), ...(debouncedSearch ? { q: debouncedSearch } : {}), page }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status: newStatus }) => api.updateMessage(id, { status: newStatus }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const updateNotes = useMutation({
    mutationFn: ({ id, staffNotes }) => api.updateMessage(id, { staffNotes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  return (
    <div>
      <Seo title="Messages | Livora Admin" description="Manage contact messages." path="/admin/messages" noindex />
      <h1 className="text-[1.6rem] mb-s3">Messages</h1>

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
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={6}>Loading…</td>
              </tr>
            )}
            {!isLoading && data?.items?.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-muted" colSpan={6}>No messages found.</td>
              </tr>
            )}
            {data?.items?.map((m) => (
              <Fragment key={m.id}>
                <tr className="border-b border-line last:border-0 align-top">
                  <td className="px-4 py-3 font-semibold text-ink">
                    {m.fullName}
                    <span className="block text-muted font-normal text-[0.8rem]">{m.email}</span>
                    {m.phone && <span className="block text-muted font-normal text-[0.8rem]">{m.phone}</span>}
                  </td>
                  <td className="px-4 py-3">{humanize(m.subject)}</td>
                  <td className="px-4 py-3 max-w-[320px]">
                    <span className="line-clamp-2 text-muted">{m.message}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5 items-start">
                      <StatusPill status={m.status} />
                      <StatusSelect
                        value={m.status}
                        disabled={updateStatus.isPending}
                        onChange={(newStatus) => updateStatus.mutate({ id: m.id, status: newStatus })}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                      className="text-[0.82rem] font-semibold text-cyan-700 hover:underline whitespace-nowrap"
                    >
                      {m.staffNotes ? '● Notes' : '+ Notes'}
                      {expandedId === m.id ? ' ▾' : ' ▸'}
                    </button>
                  </td>
                </tr>
                {expandedId === m.id && (
                  <NotesRow
                    colSpan={6}
                    patientMessage={m.message}
                    patientMessageLabel="Full message"
                    notes={m.staffNotes}
                    saving={updateNotes.isPending}
                    onSave={(staffNotes) => updateNotes.mutateAsync({ id: m.id, staffNotes })}
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
