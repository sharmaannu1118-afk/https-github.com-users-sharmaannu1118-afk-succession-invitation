import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Activity, ActivityType, ActivityStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const TYPES: ActivityType[] = ['Call', 'Email', 'Meeting', 'Note', 'Task'];
const STATUSES: ActivityStatus[] = ['Planned', 'Completed', 'Cancelled'];
const TEAM = ['Annu Chelaramani', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];

function newId() { return 'act' + Date.now(); }

const TYPE_ICON: Record<ActivityType, string> = {
  Call: '📞', Email: '📧', Meeting: '📅', Note: '📝', Task: '✅'
};
const TYPE_COLOR: Record<ActivityType, string> = {
  Call: 'bg-green-100 text-green-700',
  Email: 'bg-yellow-100 text-yellow-700',
  Meeting: 'bg-blue-100 text-blue-700',
  Note: 'bg-gray-100 text-gray-700',
  Task: 'bg-purple-100 text-purple-700',
};

const EMPTY: Omit<Activity, 'id' | 'createdAt'> = {
  type: 'Call', subject: '', status: 'Planned',
  relatedTo: 'client', relatedId: '', relatedName: '',
  assignedTo: 'Annu Chelaramani',
  dueDate: new Date().toISOString().slice(0, 10),
};

export default function Activities() {
  const { activities, clients, candidates, leads, jobOrders, addActivity, updateActivity, deleteActivity } = useCRM();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [form, setForm] = useState<Omit<Activity, 'id' | 'createdAt'>>(EMPTY);

  const filtered = activities.filter(a => {
    const matchSearch = a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.relatedName.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || a.type === typeFilter;
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const planned = activities.filter(a => a.status === 'Planned').length;
  const completed = activities.filter(a => a.status === 'Completed').length;
  const overdue = activities.filter(a => a.status === 'Planned' && a.dueDate < new Date().toISOString().slice(0, 10)).length;

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(a: Activity) {
    setEditing(a);
    const { id, createdAt, ...rest } = a;
    setForm(rest); setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    if (editing) { updateActivity({ ...editing, ...form }); }
    else { addActivity({ ...form, id: newId(), createdAt: now }); }
    setShowForm(false);
  }

  function markComplete(a: Activity) {
    updateActivity({ ...a, status: 'Completed', completedAt: new Date().toISOString().slice(0, 10) });
  }

  const relatedOptions = {
    client: clients.map(c => ({ id: c.id, name: c.name })),
    contact: [],
    lead: leads.map(l => ({ id: l.id, name: l.title })),
    candidate: candidates.map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}` })),
    job: jobOrders.map(j => ({ id: j.id, name: j.title })),
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-3">
          <Clock size={20} className="text-blue-500" />
          <div>
            <p className="text-xl font-bold text-gray-900">{planned}</p>
            <p className="text-xs text-gray-500">Planned</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-500" />
          <div>
            <p className="text-xl font-bold text-gray-900">{completed}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <Clock size={20} className="text-red-500" />
          <div>
            <p className="text-xl font-bold text-red-600">{overdue}</p>
            <p className="text-xs text-gray-500">Overdue</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities..." className="input pl-9" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input w-32">
          <option value="All">All Types</option>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-36">
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="ml-auto flex gap-2 flex-wrap">
          <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add Activity</button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Type</th>
                <th className="th">Subject</th>
                <th className="th">Related To</th>
                <th className="th">Assigned To</th>
                <th className="th">Due Date</th>
                <th className="th">Status</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="td text-center text-gray-400 py-10">No activities found.</td></tr>
              ) : filtered.map(a => {
                const isOverdue = a.status === 'Planned' && a.dueDate < new Date().toISOString().slice(0, 10);
                return (
                  <tr key={a.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="td">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${TYPE_COLOR[a.type]}`}>
                        {TYPE_ICON[a.type]}
                      </span>
                    </td>
                    <td className="td font-medium text-gray-900">{a.subject}</td>
                    <td className="td text-gray-500 text-xs">{a.relatedName}</td>
                    <td className="td text-gray-500">{a.assignedTo}</td>
                    <td className={`td text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                      {a.dueDate}
                    </td>
                    <td className="td"><StatusBadge value={a.status} /></td>
                    <td className="td">
                      <div className="flex gap-2">
                        {a.status === 'Planned' && (
                          <button onClick={() => markComplete(a)} title="Mark complete"
                            className="text-gray-400 hover:text-green-600">
                            <CheckCircle2 size={15} />
                          </button>
                        )}
                        <button onClick={() => openEdit(a)} className="text-gray-400 hover:text-brand-600"><Pencil size={15} /></button>
                        <button onClick={() => deleteActivity(a.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
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
        <Modal title={editing ? 'Edit Activity' : 'Add Activity'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value as ActivityType }))}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as ActivityStatus }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Subject *</label>
              <input required className="input" value={form.subject}
                onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} />
            </div>
            <div>
              <label className="label">Related To</label>
              <select className="input" value={form.relatedTo}
                onChange={e => setForm(p => ({ ...p, relatedTo: e.target.value as Activity['relatedTo'], relatedId: '', relatedName: '' }))}>
                <option value="client">Client</option>
                <option value="lead">Lead</option>
                <option value="candidate">Candidate</option>
                <option value="job">Job Order</option>
              </select>
            </div>
            <div>
              <label className="label">Select Record</label>
              <select className="input" value={form.relatedId}
                onChange={e => {
                  const opts = relatedOptions[form.relatedTo] ?? [];
                  const opt = opts.find(o => o.id === e.target.value);
                  setForm(p => ({ ...p, relatedId: e.target.value, relatedName: opt?.name ?? '' }));
                }}>
                <option value="">-- Select --</option>
                {(relatedOptions[form.relatedTo] ?? []).map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Assigned To</label>
              <select className="input" value={form.assignedTo}
                onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}>
                {TEAM.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input type="date" className="input" value={form.dueDate}
                onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea rows={3} className="input resize-none" value={form.description ?? ''}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Activity'}</button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
