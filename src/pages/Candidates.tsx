import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Candidate, CandidateStatus, ExperienceLevel } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const STATUSES: CandidateStatus[] = ['Active', 'Passive', 'Placed', 'Blacklisted', 'On Hold'];
const EXP_LEVELS: ExperienceLevel[] = ['Entry', 'Mid', 'Senior', 'Lead', 'Director', 'C-Suite'];
const TEAM = ['Annu Sharma', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];

function newId() { return 'ca' + Date.now(); }

const fmt = (n: number) =>
  n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

const EMPTY: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'> = {
  firstName: '', lastName: '', email: '', currentTitle: '',
  experienceLevel: 'Mid', yearsOfExperience: 0, skills: [],
  location: '', status: 'Active', addedBy: 'Annu Sharma',
};

export default function Candidates() {
  const { candidates, addCandidate, updateCandidate, deleteCandidate, jobOrders, clients } = useCRM();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [jobFilter, setJobFilter] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Candidate | null>(null);
  const [viewing, setViewing] = useState<Candidate | null>(null);
  const [form, setForm] = useState<Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);
  const [skillInput, setSkillInput] = useState('');

  const openJobs = jobOrders.filter(j => ['Open', 'In Progress'].includes(j.status));
  const selectedJob = openJobs.find(j => j.id === jobFilter) ?? null;

  const filtered = candidates.filter(c => {
    const name = `${c.firstName} ${c.lastName} ${c.currentTitle} ${c.skills.join(' ')}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchExp = expFilter === 'All' || c.experienceLevel === expFilter;
    const matchJob = !selectedJob || selectedJob.skills.some(js =>
      c.skills.some(cs => cs.toLowerCase().includes(js.toLowerCase()) || js.toLowerCase().includes(cs.toLowerCase()))
    );
    return matchSearch && matchStatus && matchExp && matchJob;
  });

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setSkillInput('');
    setShowForm(true);
  }

  function openEdit(c: Candidate) {
    setEditing(c);
    const { id, createdAt, updatedAt, ...rest } = c;
    setForm(rest);
    setSkillInput('');
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

  function addSkill() {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm(p => ({ ...p, skills: [...p.skills, s] }));
    }
    setSkillInput('');
  }

  function removeSkill(skill: string) {
    setForm(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));
  }

  return (
    <div className="space-y-4">

      {/* Open Job Profiles */}
      {openJobs.length > 0 && (
        <div className="card p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Open Positions — Click to find matching candidates
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {openJobs.map(j => {
              const client = clients.find(c => c.id === j.clientId);
              const isSelected = jobFilter === j.id;
              return (
                <button key={j.id} onClick={() => setJobFilter(isSelected ? null : j.id)}
                  className={`flex-shrink-0 text-left rounded-xl border-2 p-3 w-52 transition-all ${
                    isSelected ? 'bg-brand-600 border-brand-600 text-white shadow-md' : 'bg-gray-50 border-gray-200 hover:border-brand-400 hover:bg-white'
                  }`}>
                  <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>{j.title}</p>
                  <p className={`text-xs truncate mb-2 ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>{client?.name} · {j.location}</p>
                  <div className="flex flex-wrap gap-1">
                    {j.skills.slice(0, 4).map(s => (
                      <span key={s} className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'
                      }`}>{s}</span>
                    ))}
                    {j.skills.length > 4 && <span className={`text-xs ${isSelected ? 'text-white/60' : 'text-gray-400'}`}>+{j.skills.length - 4}</span>}
                  </div>
                </button>
              );
            })}
          </div>
          {selectedJob && (
            <p className="text-xs text-brand-600 font-medium mt-2">
              Filtering for "{selectedJob.title}" — {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} match
              {filtered.length === 0 && candidates.length > 0 ? ' — try adding candidates with relevant skills' : ''}
            </p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
            placeholder="Search by name, title, skills..." className="input pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-36">
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={expFilter} onChange={e => setExpFilter(e.target.value)} className="input w-36">
          <option value="All">All Levels</option>
          {EXP_LEVELS.map(e => <option key={e}>{e}</option>)}
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
                <th className="th">Candidate</th>
                <th className="th">Current Role</th>
                <th className="th">Level</th>
                <th className="th">Exp</th>
                <th className="th">Location</th>
                <th className="th">Expected CTC</th>
                <th className="th">Status</th>
                <th className="th">Skills</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} className="td text-center text-gray-400 py-10">No candidates found.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="td">
                    <button onClick={() => setViewing(c)} className="flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {c.firstName[0]}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 group-hover:text-brand-600">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </button>
                  </td>
                  <td className="td text-gray-700">{c.currentTitle}</td>
                  <td className="td text-gray-500 text-xs">{c.experienceLevel}</td>
                  <td className="td text-gray-500">{c.yearsOfExperience}y</td>
                  <td className="td text-gray-500">{c.location}</td>
                  <td className="td text-gray-700">{c.expectedSalary ? fmt(c.expectedSalary) : '—'}</td>
                  <td className="td"><StatusBadge value={c.status} /></td>
                  <td className="td">
                    <div className="flex flex-wrap gap-1">
                      {c.skills.slice(0, 3).map(s => (
                        <span key={s} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{s}</span>
                      ))}
                      {c.skills.length > 3 && <span className="text-xs text-gray-400">+{c.skills.length - 3}</span>}
                    </div>
                  </td>
                  <td className="td">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-brand-600"><Pencil size={15} /></button>
                      <button onClick={() => deleteCandidate(c.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewing && (
        <Modal title={`${viewing.firstName} ${viewing.lastName}`} onClose={() => setViewing(null)} size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold">
                  {viewing.firstName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{viewing.firstName} {viewing.lastName}</h3>
                  <p className="text-sm text-gray-600">{viewing.currentTitle}</p>
                  {viewing.currentCompany && <p className="text-xs text-gray-400">{viewing.currentCompany}</p>}
                </div>
              </div>
              <dl className="space-y-2 text-sm">
                {[
                  ['Email', viewing.email],
                  ['Phone', viewing.phone],
                  ['Location', viewing.location],
                  ['Experience', `${viewing.yearsOfExperience} years · ${viewing.experienceLevel}`],
                  ['Current CTC', viewing.currentSalary ? fmt(viewing.currentSalary) : '—'],
                  ['Expected CTC', viewing.expectedSalary ? fmt(viewing.expectedSalary) : '—'],
                  ['Status', null],
                  ['Added By', viewing.addedBy],
                ].map(([k, v]) => k === 'Status' ? (
                  <div key="Status" className="flex gap-2">
                    <dt className="text-gray-500 w-32 flex-shrink-0">Status</dt>
                    <dd><StatusBadge value={viewing.status} /></dd>
                  </div>
                ) : v ? (
                  <div key={k as string} className="flex gap-2">
                    <dt className="text-gray-500 w-32 flex-shrink-0">{k}</dt>
                    <dd className="text-gray-900 font-medium">{v}</dd>
                  </div>
                ) : null)}
              </dl>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {viewing.skills.map(s => (
                  <span key={s} className="px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">{s}</span>
                ))}
              </div>
              {viewing.notes && (
                <div className="p-3 bg-yellow-50 rounded-lg text-sm text-gray-700">
                  <p className="font-medium text-xs text-yellow-700 mb-1">Notes</p>
                  {viewing.notes}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <button onClick={() => { setViewing(null); openEdit(viewing); }} className="btn-secondary">
              <Pencil size={15} /> Edit
            </button>
          </div>
        </Modal>
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Candidate' : 'Add Candidate'} onClose={() => setShowForm(false)} size="lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input required className="input" value={form.firstName}
                onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input required className="input" value={form.lastName}
                onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
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
              <label className="label">Current Title *</label>
              <input required className="input" value={form.currentTitle}
                onChange={e => setForm(p => ({ ...p, currentTitle: e.target.value }))} />
            </div>
            <div>
              <label className="label">Current Company</label>
              <input className="input" value={form.currentCompany ?? ''}
                onChange={e => setForm(p => ({ ...p, currentCompany: e.target.value }))} />
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
              <label className="label">Location</label>
              <input className="input" value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as CandidateStatus }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
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
              <input className="input" value={form.linkedin ?? ''}
                onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="input flex-1" placeholder="Add skill and press Enter"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                />
                <button type="button" onClick={addSkill} className="btn-secondary">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map(s => (
                  <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="text-brand-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
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
