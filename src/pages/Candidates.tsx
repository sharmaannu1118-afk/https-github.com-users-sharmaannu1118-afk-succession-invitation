import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Candidate, CandidateStatus, ExperienceLevel } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LocationSelect from '../components/LocationSelect';

const STATUSES: CandidateStatus[] = [
  'Shortlisted', 'Interviewed', 'Interview Scheduled',
  'On Hold', 'Rejected', 'Blacklisted', 'Withdrawn', 'Hired',
];
const EXP_LEVELS: ExperienceLevel[] = ['Entry', 'Mid', 'Senior', 'Lead', 'Director', 'C-Suite'];
const NOTICE_PERIODS = ['Immediate', '15 Days', '30 Days', '45 Days', '60 Days', '90 Days', 'Serving Notice'];
const TEAM = ['Annu Chelaramani', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];

function newId() { return 'ca' + Date.now(); }

const fmt = (n: number) =>
  n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;

const EMPTY: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'> = {
  firstName: '', lastName: '', email: '', currentTitle: '',
  experienceLevel: 'Mid', yearsOfExperience: 0, skills: [],
  location: '', status: 'Shortlisted', addedBy: 'Annu Chelaramani',
};

export default function Candidates() {
  const { candidates, addCandidate, updateCandidate, deleteCandidate, jobOrders, clients } = useCRM();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Candidate | null>(null);
  const [viewing, setViewing] = useState<Candidate | null>(null);
  const [form, setForm] = useState<Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);

  const filtered = candidates.filter(c => {
    const name = `${c.firstName} ${c.currentTitle}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(c: Candidate) {
    setEditing(c);
    const { id, createdAt, updatedAt, ...rest } = c;
    setForm(rest);
    setViewing(null);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    if (editing) {
      updateCandidate({ ...editing, ...form, updatedAt: now });
    } else {
      addCandidate({ ...form, id: newId(), createdAt: now, updatedAt: now });
    }
    setShowForm(false);
  }

  function handleResumeUpload(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setForm(p => ({ ...p, resumeUrl: reader.result as string, resumeFileName: file.name }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {STATUSES.map(s => (
          <div key={s} className="card p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{candidates.filter(c => c.status === s).length}</p>
            <p className="text-xs text-gray-500">{s}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, title, email..." className="input pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-44">
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={openAdd} className="btn-primary ml-auto">
          <Plus size={16} /> Add Candidate
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Candidate Name</th>
                <th className="th">Current Role</th>
                <th className="th">Job Applied For</th>
                <th className="th">Location</th>
                <th className="th">Notice Period</th>
                <th className="th">Status</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="td text-center text-gray-400 py-10">No candidates found.</td></tr>
              ) : filtered.map(c => {
                const appliedJob = jobOrders.find(j => j.id === c.jobOrderId);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setViewing(c)}>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {c.firstName[0] ?? '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                          <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td text-gray-700">{c.currentTitle || '—'}</td>
                    <td className="td text-gray-600 text-xs">{appliedJob?.title ?? '—'}</td>
                    <td className="td text-gray-500 text-xs">{c.location || '—'}</td>
                    <td className="td text-gray-500 text-xs">{c.noticePeriod || '—'}</td>
                    <td className="td"><StatusBadge value={c.status} /></td>
                    <td className="td" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-brand-600"><Pencil size={15} /></button>
                        <button onClick={() => deleteCandidate(c.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Popup ── */}
      {viewing && (() => {
        const appliedJob = jobOrders.find(j => j.id === viewing.jobOrderId);
        const jobClient  = appliedJob ? clients.find(c => c.id === appliedJob.clientId) : null;
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl p-6 text-white flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {viewing.firstName[0] ?? '?'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{viewing.firstName} {viewing.lastName}</h2>
                      <p className="text-sm text-purple-200">{viewing.currentTitle}</p>
                      {viewing.currentCompany && <p className="text-xs text-purple-300">{viewing.currentCompany}</p>}
                      <div className="mt-2"><StatusBadge value={viewing.status} /></div>
                    </div>
                  </div>
                  <button onClick={() => setViewing(null)} className="text-white/70 hover:text-white ml-2 flex-shrink-0"><X size={20} /></button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3 overflow-y-auto flex-1">
                {appliedJob && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">J</div>
                    <div>
                      <p className="text-xs text-blue-500">Applied For</p>
                      <p className="text-sm font-semibold text-gray-900">{appliedJob.title}</p>
                      {jobClient && <p className="text-xs text-gray-500">{jobClient.name}</p>}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {viewing.email && (
                    <a href={`mailto:${viewing.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 transition-colors">
                      <Mail size={16} className="text-blue-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-800">{viewing.email}</p>
                      </div>
                    </a>
                  )}
                  {viewing.phone && (
                    <a href={`tel:${viewing.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-green-50 transition-colors">
                      <Phone size={16} className="text-green-500 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-800">{viewing.phone}</p>
                      </div>
                    </a>
                  )}
                  {viewing.location && (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                      <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm font-medium text-gray-800">{viewing.location}</p>
                      </div>
                    </div>
                  )}
                </div>

                <dl className="space-y-2 text-sm">
                  {[
                    ['Experience', `${viewing.yearsOfExperience} yrs · ${viewing.experienceLevel}`],
                    ['Notice Period', viewing.noticePeriod],
                    ['Current CTC', viewing.currentSalary ? fmt(viewing.currentSalary) : null],
                    ['Expected CTC', viewing.expectedSalary ? fmt(viewing.expectedSalary) : null],
                    ['Added By', viewing.addedBy],
                    ['Created', viewing.createdAt],
                  ].map(([k, v]) => v ? (
                    <div key={k as string} className="flex gap-2">
                      <dt className="text-gray-500 w-32 flex-shrink-0">{k}</dt>
                      <dd className="font-medium text-gray-900">{v}</dd>
                    </div>
                  ) : null)}
                </dl>

                {viewing.resumeUrl && viewing.resumeFileName && (
                  <a href={viewing.resumeUrl} download={viewing.resumeFileName}
                    className="flex items-center gap-3 p-3 rounded-xl border border-green-200 bg-green-50 hover:bg-green-100 transition-colors">
                    <FileText size={16} className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-green-600">Resume</p>
                      <p className="text-sm font-medium text-green-800">{viewing.resumeFileName}</p>
                    </div>
                  </a>
                )}

                {viewing.notes && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 font-medium mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{viewing.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex gap-3 flex-shrink-0">
                <button onClick={() => openEdit(viewing)} className="flex-1 btn-primary justify-center flex items-center gap-2">
                  <Pencil size={14} /> Edit Candidate
                </button>
                <button onClick={() => setViewing(null)} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <Modal title={editing ? 'Edit Candidate' : 'Add Candidate'} onClose={() => setShowForm(false)} size="lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="sm:col-span-2">
              <label className="label">Candidate Name *</label>
              <input required className="input" placeholder="Full name"
                value={form.firstName}
                onChange={e => setForm(p => ({ ...p, firstName: e.target.value, lastName: '' }))} />
            </div>

            <div>
              <label className="label">Email *</label>
              <input required type="email" className="input" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone ?? ''}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>

            <div>
              <label className="label">Current Title</label>
              <input className="input" value={form.currentTitle}
                onChange={e => setForm(p => ({ ...p, currentTitle: e.target.value }))} />
            </div>
            <div>
              <label className="label">Current Company</label>
              <input className="input" value={form.currentCompany ?? ''}
                onChange={e => setForm(p => ({ ...p, currentCompany: e.target.value }))} />
            </div>

            <div>
              <label className="label">Job Title (Applied For)</label>
              <select className="input" value={form.jobOrderId ?? ''}
                onChange={e => setForm(p => ({ ...p, jobOrderId: e.target.value || undefined }))}>
                <option value="">-- Select Job Order --</option>
                {jobOrders.map(j => {
                  const cl = clients.find(c => c.id === j.clientId);
                  return <option key={j.id} value={j.id}>{j.title}{cl ? ` — ${cl.name}` : ''}</option>;
                })}
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as CandidateStatus }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Location</label>
              <LocationSelect value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))} />
            </div>

            <div>
              <label className="label">Notice Period</label>
              <select className="input" value={form.noticePeriod ?? ''}
                onChange={e => setForm(p => ({ ...p, noticePeriod: e.target.value || undefined }))}>
                <option value="">-- Select --</option>
                {NOTICE_PERIODS.map(n => <option key={n}>{n}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Experience Level</label>
              <select className="input" value={form.experienceLevel}
                onChange={e => setForm(p => ({ ...p, experienceLevel: e.target.value as ExperienceLevel }))}>
                {EXP_LEVELS.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Years of Experience</label>
              <input type="number" className="input" value={form.yearsOfExperience}
                onChange={e => setForm(p => ({ ...p, yearsOfExperience: +e.target.value }))} />
            </div>

            <div>
              <label className="label">Current CTC (₹)</label>
              <input type="number" className="input" value={form.currentSalary ?? ''}
                onChange={e => setForm(p => ({ ...p, currentSalary: +e.target.value || undefined }))} />
            </div>
            <div>
              <label className="label">Expected CTC (₹)</label>
              <input type="number" className="input" value={form.expectedSalary ?? ''}
                onChange={e => setForm(p => ({ ...p, expectedSalary: +e.target.value || undefined }))} />
            </div>

            <div>
              <label className="label">Added By</label>
              <select className="input" value={form.addedBy}
                onChange={e => setForm(p => ({ ...p, addedBy: e.target.value }))}>
                {TEAM.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">LinkedIn URL</label>
              <input className="input" placeholder="https://linkedin.com/in/..." value={form.linkedin ?? ''}
                onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Upload Resume</label>
              <input type="file" accept=".pdf,.doc,.docx"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f); }} />
              {form.resumeFileName && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <FileText size={12} /> {form.resumeFileName}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea rows={2} className="input resize-none" value={form.notes ?? ''}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Candidate'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
