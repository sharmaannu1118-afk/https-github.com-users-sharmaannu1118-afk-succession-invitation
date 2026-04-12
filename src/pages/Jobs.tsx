import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { JobOrder, JobStatus, JobType, Priority } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const STATUSES: JobStatus[] = ['Open', 'In Progress', 'On Hold', 'Closed', 'Cancelled'];
const TYPES: JobType[] = ['Permanent', 'Contract', 'Temporary', 'Executive Search'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];
const TEAM = ['Annu Sharma', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];

function newId() { return 'j' + Date.now(); }
const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

const EMPTY: Omit<JobOrder, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', clientId: '', status: 'Open', type: 'Permanent',
  priority: 'Medium', openings: 1, location: '', skills: [],
  recruiter: 'Annu Sharma',
};

export default function Jobs() {
  const { jobOrders, clients, contacts, addJobOrder, updateJobOrder, deleteJobOrder } = useCRM();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobOrder | null>(null);
  const [form, setForm] = useState<Omit<JobOrder, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);
  const [skillInput, setSkillInput] = useState('');

  const filtered = jobOrders.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      (clients.find(c => c.id === j.clientId)?.name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openAdd() { setEditing(null); setForm(EMPTY); setSkillInput(''); setShowForm(true); }
  function openEdit(j: JobOrder) {
    setEditing(j);
    const { id, createdAt, updatedAt, ...rest } = j;
    setForm(rest); setSkillInput(''); setShowForm(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    if (editing) { updateJobOrder({ ...editing, ...form, updatedAt: now }); }
    else { addJobOrder({ ...form, id: newId(), createdAt: now, updatedAt: now }); }
    setShowForm(false);
  }
  function addSkill() {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) setForm(p => ({ ...p, skills: [...p.skills, s] }));
    setSkillInput('');
  }

  const priorityDot: Record<Priority, string> = {
    Low: 'bg-gray-400', Medium: 'bg-yellow-400', High: 'bg-orange-500', Urgent: 'bg-red-500'
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUSES.map(s => (
          <div key={s} className="card p-3 text-center">
            <p className="text-xl font-bold text-gray-900">{jobOrders.filter(j => j.status === s).length}</p>
            <p className="text-xs text-gray-500">{s}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search job orders..." className="input pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-40">
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={openAdd} className="btn-primary ml-auto"><Plus size={16} /> Add Job Order</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Job Title</th>
                <th className="th">Client</th>
                <th className="th">Type</th>
                <th className="th">Status</th>
                <th className="th">Priority</th>
                <th className="th">Openings</th>
                <th className="th">Salary Range</th>
                <th className="th">Recruiter</th>
                <th className="th">Deadline</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} className="td text-center text-gray-400 py-10">No job orders found.</td></tr>
              ) : filtered.map(j => {
                const client = clients.find(c => c.id === j.clientId);
                return (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="td font-medium text-gray-900">{j.title}</td>
                    <td className="td text-gray-600">{client?.name ?? '—'}</td>
                    <td className="td"><StatusBadge value={j.type} /></td>
                    <td className="td"><StatusBadge value={j.status} /></td>
                    <td className="td">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${priorityDot[j.priority]}`} />
                        <span className="text-xs text-gray-600">{j.priority}</span>
                      </div>
                    </td>
                    <td className="td text-gray-600">{j.openings}</td>
                    <td className="td text-gray-600 text-xs">
                      {j.salaryMin && j.salaryMax ? `${fmt(j.salaryMin)} – ${fmt(j.salaryMax)}` : '—'}
                    </td>
                    <td className="td text-gray-500">{j.recruiter}</td>
                    <td className="td text-gray-500">{j.deadline ?? '—'}</td>
                    <td className="td">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(j)} className="text-gray-400 hover:text-brand-600"><Pencil size={15} /></button>
                        <button onClick={() => deleteJobOrder(j.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Job Order' : 'Add Job Order'} onClose={() => setShowForm(false)} size="lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Job Title *</label>
              <input required className="input" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Client</label>
              <select className="input" value={form.clientId}
                onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}>
                <option value="">-- Select --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Contact</label>
              <select className="input" value={form.contactId ?? ''}
                onChange={e => setForm(p => ({ ...p, contactId: e.target.value || undefined }))}>
                <option value="">-- Select --</option>
                {contacts.filter(ct => !form.clientId || ct.clientId === form.clientId).map(ct => (
                  <option key={ct.id} value={ct.id}>{ct.firstName} {ct.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as JobStatus }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value as JobType }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value as Priority }))}>
                {PRIORITIES.map(pr => <option key={pr}>{pr}</option>)}
              </select>
            </div>
            <div>
              <label className="label">No. of Openings</label>
              <input type="number" min="1" className="input" value={form.openings}
                onChange={e => setForm(p => ({ ...p, openings: +e.target.value }))} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div>
              <label className="label">Salary Min (₹)</label>
              <input type="number" className="input" value={form.salaryMin ?? ''}
                onChange={e => setForm(p => ({ ...p, salaryMin: +e.target.value || undefined }))} />
            </div>
            <div>
              <label className="label">Salary Max (₹)</label>
              <input type="number" className="input" value={form.salaryMax ?? ''}
                onChange={e => setForm(p => ({ ...p, salaryMax: +e.target.value || undefined }))} />
            </div>
            <div>
              <label className="label">Recruiter</label>
              <select className="input" value={form.recruiter}
                onChange={e => setForm(p => ({ ...p, recruiter: e.target.value }))}>
                {TEAM.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Deadline</label>
              <input type="date" className="input" value={form.deadline ?? ''}
                onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Required Skills</label>
              <div className="flex gap-2 mb-2">
                <input className="input flex-1" placeholder="Type skill and press Enter" value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} />
                <button type="button" onClick={addSkill} className="btn-secondary">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map(s => (
                  <span key={s} className="flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">
                    {s}
                    <button type="button" onClick={() => setForm(p => ({ ...p, skills: p.skills.filter(x => x !== s) }))} className="text-brand-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea rows={3} className="input resize-none" value={form.description ?? ''}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Job Order'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
