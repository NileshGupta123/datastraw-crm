import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ticketsApi } from '../api';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Toast from '../components/Toast';

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const [statusDraft, setStatusDraft] = useState('');
  const [priorityDraft, setPriorityDraft] = useState('');
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const fetchTicket = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await ticketsApi.getById(ticketId);
      setTicket(res.data);
      setStatusDraft(res.data.status);
      setPriorityDraft(res.data.priority);
    } catch (err) {
      setError('Ticket not found.');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await ticketsApi.update(ticketId, {
        status: statusDraft,
        priority: priorityDraft,
        notes: noteText.trim() ? noteText.trim() : undefined,
      });
      setNoteText('');
      setToast({ message: 'Ticket updated!', type: 'success' });
      fetchTicket();
    } catch (err) {
      setToast({ message: 'Failed to update ticket', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAiSuggest = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await ticketsApi.aiSuggest(ticketId);
      setAiResult(res.data);
    } catch (err) {
      setToast({ message: 'AI suggestion failed', type: 'error' });
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestions = () => {
    if (!aiResult) return;
    setPriorityDraft(aiResult.suggested_priority);
    setNoteText(aiResult.suggested_response);
    setToast({ message: 'AI suggestions applied — review and save', type: 'info' });
  };

  if (loading) return <p className="text-center text-gray-500 py-8">Loading ticket...</p>;
  if (error) return <p className="text-center text-red-600 py-8">{error}</p>;
  if (!ticket) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="text-brand hover:underline text-sm">&larr; Back to all tickets</Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{ticket.ticket_id}</h1>
          <p className="text-gray-500">{ticket.subject}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Customer Name</p>
          <p className="font-medium">{ticket.customer_name}</p>
        </div>
        <div>
          <p className="text-gray-500">Customer Email</p>
          <p className="font-medium">{ticket.customer_email}</p>
        </div>
        <div>
          <p className="text-gray-500">Created</p>
          <p className="font-medium">{new Date(ticket.created_at).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Last Updated</p>
          <p className="font-medium">{new Date(ticket.updated_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-gray-500 text-sm mb-1">Description</p>
        <p className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">{ticket.description}</p>
      </div>

      {/* AI Assist */}
      <div className="mt-6 border border-brand/30 rounded-lg p-4 bg-brand/5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">✨ AI Assist</h2>
          <button
            onClick={handleAiSuggest}
            disabled={aiLoading}
            className="bg-brand hover:bg-brand-dark text-white text-sm px-4 py-1.5 rounded-lg disabled:opacity-50"
          >
            {aiLoading ? 'Thinking...' : 'Get Suggestions'}
          </button>
        </div>

        {aiResult && (
          <div className="mt-4 space-y-2 text-sm">
            <p><span className="text-gray-500">Summary:</span> {aiResult.summary}</p>
            <p>
              <span className="text-gray-500">Suggested Priority:</span>{' '}
              <PriorityBadge priority={aiResult.suggested_priority} /> — {aiResult.suggested_priority_reason}
            </p>
            <p><span className="text-gray-500">Suggested Reply:</span> {aiResult.suggested_response}</p>
            <button
              onClick={applyAiSuggestions}
              className="mt-2 text-brand hover:underline text-sm font-medium"
            >
              Apply to form below
            </button>
          </div>
        )}
      </div>

      {/* Update section */}
      <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="font-semibold mb-3">Update Ticket</h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={statusDraft}
              onChange={(e) => setStatusDraft(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={priorityDraft}
              onChange={(e) => setPriorityDraft(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <label className="block text-sm font-medium mb-1">Add Note</label>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          rows={3}
          placeholder="Add a note or comment..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 mb-4"
        />

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="bg-brand hover:bg-brand-dark text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Notes history */}
      {ticket.notes.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-3">Notes History</h2>
          <div className="space-y-2">
            {ticket.notes.slice().reverse().map((note) => (
              <div key={note.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm">
                <p>{note.note_text}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}