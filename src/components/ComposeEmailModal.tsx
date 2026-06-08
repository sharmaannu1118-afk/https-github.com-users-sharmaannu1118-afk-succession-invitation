import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import { useGoogleGmail } from '../hooks/useGoogleGmail';
import { useCRM } from '../context/CRMContext';
import type { Activity } from '../types';

interface Props {
  onClose: () => void;
  prefill?: {
    to?: string;
    subject?: string;
    relatedTo?: Activity['relatedTo'];
    relatedId?: string;
    relatedName?: string;
  };
}

export default function ComposeEmailModal({ onClose, prefill }: Props) {
  const { sendEmail } = useGoogleGmail();
  const { addActivity } = useCRM();

  const [form, setForm] = useState({
    to: prefill?.to ?? '',
    cc: '',
    subject: prefill?.subject ?? '',
    body: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendEmail({
        to: form.to,
        cc: form.cc || undefined,
        subject: form.subject,
        body: form.body,
      });

      // Mirror into CRM Activities as completed email
      addActivity({
        id: `act${Date.now()}`,
        type: 'Email',
        subject: form.subject,
        description: form.body,
        status: 'Completed',
        relatedTo: prefill?.relatedTo ?? 'client',
        relatedId: prefill?.relatedId ?? '',
        relatedName: prefill?.relatedName ?? '',
        assignedTo: 'Annu Chelaramani',
        dueDate: new Date().toISOString().slice(0, 10),
        completedAt: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString().slice(0, 10),
      });

      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send email');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <Modal title="Email Sent!" onClose={onClose}>
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <p className="text-gray-600">
            Email sent to <strong>{form.to}</strong> via Gmail.
          </p>
          <button onClick={onClose} className="btn-primary">Done</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Compose Email" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">To *</label>
          <input required type="email" className="input" placeholder="recipient@example.com"
            value={form.to} onChange={e => setForm(p => ({ ...p, to: e.target.value }))} />
        </div>

        <div>
          <label className="label">CC <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="email" className="input" placeholder="cc@example.com"
            value={form.cc} onChange={e => setForm(p => ({ ...p, cc: e.target.value }))} />
        </div>

        <div>
          <label className="label">Subject *</label>
          <input required className="input" value={form.subject}
            onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
        </div>

        <div>
          <label className="label">Message *</label>
          <textarea required rows={7} className="input resize-none" value={form.body}
            onChange={e => setForm(p => ({ ...p, body: e.target.value }))} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary">
            <Send size={14} />
            {loading ? 'Sending...' : 'Send via Gmail'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
