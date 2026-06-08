import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { JobOrder, JobStatus, JobType, Priority } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LocationSelect from '../components/LocationSelect';

const STATUSES: JobStatus[] = ['Open', 'In Progress', 'On Hold', 'Job Position Filled', 'Closed', 'Cancelled', 'Cancel'];
const TYPES: JobType[] = ['Permanent', 'Contract', 'Temporary', 'Executive Search'];
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Urgent'];
const TEAM = ['Annu Chelaramani', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];
const BUDGET_TYPES = ['Monthly Salary', 'CTC (INR)'] as const;

function newId() { return 'j' + Date.now(); }
const fmt = (n: number) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}`;

const EMPTY: Omit<JobOrder, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', clientId: '', status: 'Open', type: 'Permanent',
  priority: 'Medium', openings: 1, location: '', skills: [],
  recruiter: 'Annu Chelaramani',
};

const priorityDot: Record<Priority, string> = {
  Low: 'bg-gray-400', Medium: 'bg-yellow-400', High: 'bg-orange-500', Urgent: 'bg-red-500',
};

export default function Jobs() {
  const { jobOrders, clients, contacts, addJobOrder, updateJobOrder, deleteJobOrder } = useCRM();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobOrder | null>(null);
  const [viewing, setViewing] = useState<JobOrder | null>(null);
  const [form, setForm] = useState<Omit<JobOrder, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);

  const filtered = jobOrders.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      (clients.find(c => c.id === j.clientId)?.name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(j: JobOrder) {
    setEditing(j);
    const { id, createdAt, updatedAt, ...rest } = j;
    setForm(rest);
    setViewing(null);
    setShowForm(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    if (editing) { updateJobOrder({ ...editing, ...form, updatedAt: now }); }
    else { addJobOrder({ ...form, id: newId(), createdAt: now, updatedAt: now }); }
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
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
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-44">
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
                <th className="th">Salary Budget</th>
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
                  <tr key={j.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setViewing(j)}>
                    <td className="td font-medium text-gray-900 hover:text-brand-600">{j.title}</td>
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
                      {j.salaryBudget ? `${fmt(j.salaryBudget)}${j.salaryBudgetType ? ` (${j.salaryBudgetType})` : ''}` : '—'}
                    </td>
                    <td className="td text-gray-500">{j.recruiter}</td>
                    <td className="td text-gray-500">{j.deadline ?? '—'}</td>
                    <td className="td" onClick={e => e.stopPropagation()}>
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

      {/* ── Detail Popup ── */}
      {viewing && (() => {
        const client  = clients.find(c => c.id === viewing.clientId);
        const contact = contacts.find(ct => ct.id === viewing.contactId);
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-brand-600 rounded-t-2xl p-6 text-white flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{viewing.title}</h2>
                    <p className="text-sm text-blue-200 mt-1">{client?.name ?? '—'}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <StatusBadge value={viewing.status} />
                      <StatusBadge value={viewing.type} />
                    </div>
                  </div>
                  <button onClick={() => setViewing(null)} className="text-white/70 hover:text-white ml-4 flex-shrink-0"><X size={20} /></button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400">Priority</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${priorityDot[viewing.priority]}`} />
                      <p className="text-sm font-semibold text-gray-900">{viewing.priority}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400">Openings</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{viewing.openings}</p>
                  </div>
                </div>

                <dl className="space-y-2 text-sm">
                  {contact && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500 w-32 flex-shrink-0">Contact</dt>
                      <dd className="font-medium text-gray-900">{contact.firstName} {contact.lastName}</dd>
                    </div>
                  )}
                  {viewing.location && (
                    <div className="flex gap-2 items-start">
                      <dt className="text-gray-500 w-32 flex-shrink-0 flex items-center gap-1"><MapPin size={12} /> Location</dt>
                      <dd className="font-medium text-gray-900">{viewing.location}</dd>
                    </div>
                  )}
                  {viewing.salaryBudget && (
                    <div className="flex gap-2 items-start">
                      <dt className="text-gray-500 w-32 flex-shrink-0 flex items-center gap-1"><IndianRupee size={12} /> Salary Budget</dt>
                      <dd className="font-medium text-green-700">{fmt(viewing.salaryBudget)}{viewing.salaryBudgetType ? ` (${viewing.salaryBudgetType})` : ''}</dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt className="text-gray-500 w-32 flex-shrink-0">Recruiter</dt>
                    <dd className="font-medium text-gray-900">{viewing.recruiter}</dd>
                  </div>
                  {viewing.deadline && (
                    <div className="flex gap-2 items-start">
                      <dt className="text-gray-500 w-32 flex-shrink-0 flex items-center gap-1"><Calendar size={12} /> Deadline</dt>
                      <dd className="font-medium text-gray-900">{viewing.deadline}</dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt className="text-gray-500 w-32 flex-shrink-0">Created</dt>
                    <dd className="font-medium text-gray-900">{viewing.createdAt}</dd>
                  </div>
                </dl>

                {viewing.description && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 font-medium mb-1">Description</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewing.description}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex gap-3 flex-shrink-0">
                <button onClick={() => openEdit(viewing)} className="flex-1 btn-primary justify-center flex items-center gap-2">
                  <Pencil size={14} /> Edit Job Order
                </button>
                <button onClick={() => setViewing(null)} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Add / Edit Modal ── */}
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
              <LocationSelect value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))} />
            </div>
            <div>
              <label className="label">Salary Budget Type</label>
              <select className="input" value={form.salaryBudgetType ?? ''}
                onChange={e => setForm(p => ({ ...p, salaryBudgetType: (e.target.value as 'Monthly Salary' | 'CTC (INR)') || undefined }))}>
                <option value="">-- Select --</option>
                {BUDGET_TYPES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Salary Budget (₹)</label>
              <input type="number" className="input" placeholder="e.g. 50000"
                value={form.salaryBudget ?? ''}
                onChange={e => setForm(p => ({ ...p, salaryBudget: +e.target.value || undefined }))} />
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
