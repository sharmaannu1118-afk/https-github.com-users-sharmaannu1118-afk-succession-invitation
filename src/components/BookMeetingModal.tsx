import { useState } from 'react';
import { Calendar, Video, Link2, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import { useCRM } from '../context/CRMContext';
import type { Activity } from '../types';

interface Props {
  onClose: () => void;
  prefill?: {
    title?: string;
    attendeeEmail?: string;
    relatedTo?: Activity['relatedTo'];
    relatedId?: string;
    relatedName?: string;
  };
}

const DURATIONS = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1 hour', minutes: 60 },
  { label: '1.5 hours', minutes: 90 },
  { label: '2 hours', minutes: 120 },
];

function nextRounded(): { date: string; time: string } {
  const d = new Date();
  d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

export default function BookMeetingModal({ onClose, prefill }: Props) {
  const { createEvent } = useGoogleCalendar();
  const { addActivity } = useCRM();

  const { date: initDate, time: initTime } = nextRounded();
  const [form, setForm] = useState({
    title: prefill?.title ?? 'Meeting',
    date: initDate,
    startTime: initTime,
    durationMinutes: 60,
    attendees: prefill?.attendeeEmail ?? '',
    description: '',
    addMeet: true,
  });
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<{ htmlLink: string; hangoutLink?: string } | null>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const start = new Date(`${form.date}T${form.startTime}:00`);
      const end = new Date(start.getTime() + form.durationMinutes * 60_000);
      const attendeeList = form.attendees
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const event = await createEvent({
        summary: form.title,
        description: form.description,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        attendees: attendeeList,
        addMeet: form.addMeet,
      });

      // Mirror into CRM Activities
      addActivity({
        id: `act${Date.now()}`,
        type: 'Meeting',
        subject: form.title,
        description: [
          form.description,
          event.hangoutLink ? `Google Meet: ${event.hangoutLink}` : '',
        ].filter(Boolean).join('\n'),
        status: 'Planned',
        relatedTo: prefill?.relatedTo ?? 'client',
        relatedId: prefill?.relatedId ?? '',
        relatedName: prefill?.relatedName ?? '',
        assignedTo: 'Annu Chelaramani',
        dueDate: form.date,
        createdAt: new Date().toISOString().slice(0, 10),
      });

      setCreated({ htmlLink: event.htmlLink, hangoutLink: event.hangoutLink });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create meeting');
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <Modal title="Meeting Booked!" onClose={onClose}>
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <p className="text-gray-600">Your meeting has been added to Google Calendar.</p>
          <div className="flex flex-col gap-2 max-w-xs mx-auto">
            <a href={created.htmlLink} target="_blank" rel="noopener noreferrer"
              className="btn-primary justify-center">
              <Calendar size={15} /> View in Google Calendar
            </a>
            {created.hangoutLink && (
              <a href={created.hangoutLink} target="_blank" rel="noopener noreferrer"
                className="btn-secondary justify-center">
                <Video size={15} /> Join Google Meet
              </a>
            )}
          </div>
          <button onClick={onClose} className="text-sm text-gray-500 hover:underline mt-2">Close</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Book Meeting" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Meeting Title *</label>
          <input required className="input" value={form.title}
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Date *</label>
            <input required type="date" className="input" value={form.date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          </div>
          <div>
            <label className="label">Start Time *</label>
            <input required type="time" className="input" value={form.startTime}
              onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className="label">Duration</label>
          <select className="input" value={form.durationMinutes}
            onChange={e => setForm(p => ({ ...p, durationMinutes: +e.target.value }))}>
            {DURATIONS.map(d => (
              <option key={d.minutes} value={d.minutes}>{d.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Attendee Emails
            <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
          </label>
          <input className="input" placeholder="hr@company.com, ceo@company.com"
            value={form.attendees}
            onChange={e => setForm(p => ({ ...p, attendees: e.target.value }))} />
        </div>

        <div>
          <label className="label">Agenda / Description</label>
          <textarea rows={3} className="input resize-none" value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" checked={form.addMeet} className="rounded"
            onChange={e => setForm(p => ({ ...p, addMeet: e.target.checked }))} />
          <span className="text-sm text-gray-700 flex items-center gap-1.5">
            <Video size={14} className="text-blue-600" />
            Add Google Meet video link
          </span>
        </label>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            <Link2 size={14} />
            {loading ? 'Creating...' : 'Book Meeting'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
