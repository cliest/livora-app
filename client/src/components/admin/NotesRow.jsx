import { useState } from 'react';

// Expandable detail row used under a table row in Bookings/Messages — shows
// the patient's own free-text message (if any) for context, plus an
// editable staff-notes field. Both models already have a `staffNotes`
// column and the PATCH routes already accept it; this is the first UI that
// actually uses it.
export default function NotesRow({ colSpan, patientMessage, patientMessageLabel = 'Patient message', notes, onSave, saving }) {
  const [draft, setDraft] = useState(notes || '');
  const [savedAt, setSavedAt] = useState(null);
  const dirty = draft !== (notes || '');

  const handleSave = async () => {
    await onSave(draft);
    setSavedAt(Date.now());
  };

  return (
    <tr className="border-b border-line last:border-0 bg-sand">
      <td colSpan={colSpan} className="px-4 py-4">
        <div className="flex flex-col gap-s2 max-w-[640px]">
          {patientMessage && (
            <div>
              <span className="block text-[0.75rem] font-bold uppercase tracking-[0.04em] text-muted mb-1">
                {patientMessageLabel}
              </span>
              <p className="text-[0.9rem] text-ink whitespace-pre-wrap">{patientMessage}</p>
            </div>
          )}
          <div>
            <label className="block text-[0.75rem] font-bold uppercase tracking-[0.04em] text-muted mb-1">
              Staff notes
            </label>
            <textarea
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setSavedAt(null);
              }}
              rows={3}
              placeholder="e.g. Called, no answer — retrying tomorrow morning."
              className="w-full text-[0.9rem] text-ink px-3 py-2 bg-white border border-line rounded-lg focus:outline-none focus:border-cyan resize-y"
            />
            <div className="flex items-center gap-s2 mt-1.5">
              <button
                type="button"
                onClick={handleSave}
                disabled={!dirty || saving}
                className="btn btn--primary btn--sm disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save note'}
              </button>
              {!dirty && savedAt && <span className="text-[0.8rem] font-semibold text-success">Saved</span>}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
