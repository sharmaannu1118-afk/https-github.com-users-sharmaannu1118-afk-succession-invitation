import { useState } from 'react';
import { Plus, TrendingUp, CalendarCheck, UserSearch } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import Modal from './Modal';
import type { Lead, Activity } from '../types';

function newId(prefix: string) { return prefix + Date.now(); }
const today = new Date().toISOString().slice(0, 10);
const TEAM = ['Annu Sharma', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];

export default function QuickAdd() {
  const { addLead, addActivity, addCandidate } = useCRM();
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<'lead' | 'activity' | 'candidate' | null>(null);

  // ── Quick Lead ──────────────────────────────────────────────────────────
  const [lead, setLead] = useState({
    companyName: '', title: '', contactPerson: '', contactPhone: '',
    location: '', temperature: 'Warm', value: '', probability: '50',
    assignedTo: 'Annu Sharma', expectedCloseDate: today,
  });
  function submitLead(e: React.FormEvent) {
    e.preventDefault();
    addLead({
      id: newId('l'),
      companyName: lead.companyName, title: lead.title,
      contactPerson: lead.contactPerson || undefined,
      contactPhone: lead.contactPhone || undefined,
      location: lead.location,
      temperature: lead.temperature as Lead['temperature'],
      stage: 'New', source: 'Cold Call',
      value: Number(lead.value) || 0, probability: Number(lead.probability),
      assignedTo: lead.assignedTo, expectedCloseDate: lead.expectedCloseDate,
      createdAt: today, updatedAt: today,
    } as Lead);
    setModal(null);
    setLead({ companyName: '', title: '', contactPerson: '', contactPhone: '', location: '', temperature: 'Warm', value: '', probability: '50', assignedTo: 'Annu Sharma', expectedCloseDate: today });
  }

  // ── Quick Activity ─────────────────────────────────────────────────────
  const [act, setAct] = useState({ type: 'Call', subject: '', assignedTo: 'Annu Sharma', dueDate: today, relatedName: '' });
  function submitActivity(e: React.FormEvent) {
    e.preventDefault();
    addActivity({
      id: newId('act'), type: act.type as Activity['type'],
      subject: act.subject, status: 'Planned',
      relatedTo: 'client', relatedId: '', relatedName: act.relatedName,
      assignedTo: act.assignedTo, dueDate: act.dueDate,
      createdAt: today,
    });
    setModal(null);
    setAct({ type: 'Call', subject: '', assignedTo: 'Annu Sharma', dueDate: today, relatedName: '' });
  }

  // ── Quick Candidate ────────────────────────────────────────────────────
  const [cand, setCand] = useState({ firstName: '', lastName: '', email: '', currentTitle: '', location: '', skills: '' });
  function submitCandidate(e: React.FormEvent) {
    e.preventDefault();
    addCandidate({
      id: newId('ca'), firstName: cand.firstName, lastName: cand.lastName,
      email: cand.email, currentTitle: cand.currentTitle,
      experienceLevel: 'Mid', yearsOfExperience: 0,
      skills: cand.skills.split(',').map(s => s.trim()).filter(Boolean),
      location: cand.location, status: 'Shortlisted', addedBy: 'Annu Sharma',
      createdAt: today, updatedAt: today,
    });
    setModal(null);
    setCand({ firstName: '', lastName: '', email: '', currentTitle: '', location: '', skills: '' });
  }

  const actions = [
    { label: 'Add Lead',      icon: TrendingUp,   color: 'bg-brand-600',   key: 'lead'      as const },
    { label: 'Log Activity',  icon: CalendarCheck, color: 'bg-green-600',  key: 'activity'  as const },
    { label: 'Add Candidate', icon: UserSearch,    color: 'bg-purple-600', key: 'candidate' as const },
  ];

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {open && (
          <div className="flex flex-col items-end gap-2 mb-1">
            {actions.map(({ label, icon: Icon, color, key }) => (
              <button key={key}
                onClick={() => { setModal(key); setOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg ${color} hover:opacity-90 transition-all`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 ${open ? 'bg-gray-700 rotate-45' : 'bg-brand-600 hover:bg-brand-700'}`}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Click-away to close */}
      {open && <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />}

      {/* Quick Lead Modal */}
      {modal === 'lead' && (
        <Modal title="Quick Add Lead" onClose={() => setModal(null)} size="sm">
          <form onSubmit={submitLead} className="space-y-3">
            <div>
              <label className="label">Company Name *</label>
              <input required className="input" placeholder="e.g. Infosys Ltd"
                value={lead.companyName} onChange={e => setLead(p => ({ ...p, companyName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Lead Title / Requirement *</label>
              <input required className="input" placeholder="e.g. HR Manager hiring"
                value={lead.title} onChange={e => setLead(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Contact Person</label>
                <input className="input" placeholder="Name"
                  value={lead.contactPerson} onChange={e => setLead(p => ({ ...p, contactPerson: e.target.value }))} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input type="tel" className="input" placeholder="98XXXXXXXX"
                  value={lead.contactPhone} onChange={e => setLead(p => ({ ...p, contactPhone: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Location</label>
                <input className="input" placeholder="City"
                  value={lead.location} onChange={e => setLead(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div>
                <label className="label">Temperature</label>
                <select className="input" value={lead.temperature}
                  onChange={e => setLead(p => ({ ...p, temperature: e.target.value }))}>
                  <option>Hot</option><option>Warm</option><option>Cold</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Value (₹)</label>
                <input type="number" className="input" placeholder="500000"
                  value={lead.value} onChange={e => setLead(p => ({ ...p, value: e.target.value }))} />
              </div>
              <div>
                <label className="label">Probability %</label>
                <input type="number" min="0" max="100" className="input"
                  value={lead.probability} onChange={e => setLead(p => ({ ...p, probability: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label">Assigned To</label>
              <select className="input" value={lead.assignedTo}
                onChange={e => setLead(p => ({ ...p, assignedTo: e.target.value }))}>
                {TEAM.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Expected Close</label>
              <input type="date" className="input" value={lead.expectedCloseDate}
                onChange={e => setLead(p => ({ ...p, expectedCloseDate: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Add Lead</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Quick Activity Modal */}
      {modal === 'activity' && (
        <Modal title="Log Activity" onClose={() => setModal(null)} size="sm">
          <form onSubmit={submitActivity} className="space-y-3">
            <div>
              <label className="label">Type</label>
              <div className="flex gap-2 flex-wrap">
                {['Call','Email','Meeting','Task','Note'].map(t => (
                  <button key={t} type="button"
                    onClick={() => setAct(p => ({ ...p, type: t }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${act.type === t ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Subject *</label>
              <input required className="input" placeholder="e.g. Follow-up call with Rajesh"
                value={act.subject} onChange={e => setAct(p => ({ ...p, subject: e.target.value }))} />
            </div>
            <div>
              <label className="label">Related To</label>
              <input className="input" placeholder="Client / Candidate name"
                value={act.relatedName} onChange={e => setAct(p => ({ ...p, relatedName: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Due Date</label>
                <input type="date" className="input" value={act.dueDate}
                  onChange={e => setAct(p => ({ ...p, dueDate: e.target.value }))} />
              </div>
              <div>
                <label className="label">Assigned To</label>
                <select className="input" value={act.assignedTo}
                  onChange={e => setAct(p => ({ ...p, assignedTo: e.target.value }))}>
                  {TEAM.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Log Activity</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Quick Candidate Modal */}
      {modal === 'candidate' && (
        <Modal title="Add Candidate" onClose={() => setModal(null)} size="sm">
          <form onSubmit={submitCandidate} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name *</label>
                <input required className="input" value={cand.firstName}
                  onChange={e => setCand(p => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div>
                <label className="label">Last Name *</label>
                <input required className="input" value={cand.lastName}
                  onChange={e => setCand(p => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="label">Email *</label>
              <input required type="email" className="input" value={cand.email}
                onChange={e => setCand(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">Current Title</label>
              <input className="input" placeholder="e.g. Senior Software Engineer"
                value={cand.currentTitle} onChange={e => setCand(p => ({ ...p, currentTitle: e.target.value }))} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="e.g. Bengaluru"
                value={cand.location} onChange={e => setCand(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div>
              <label className="label">Skills (comma-separated)</label>
              <input className="input" placeholder="Java, Spring Boot, AWS"
                value={cand.skills} onChange={e => setCand(p => ({ ...p, skills: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Add Candidate</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
