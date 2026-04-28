import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, CheckCircle2, Circle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Task, TaskStatus, TaskPriority, TaskRelatedTo } from '../types';
import Modal from '../components/Modal';

function newId() { return 't' + Date.now(); }
const today = new Date().toISOString().slice(0, 10);

const STATUSES: TaskStatus[]    = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
const RELATED: TaskRelatedTo[]  = ['Client', 'Lead', 'Candidate', 'General'];

const EMPTY: Omit<Task, 'id' | 'createdAt'> = {
  title: '', description: '', relatedTo: 'General', relatedId: '',
  relatedName: '', assignedTo: 'Annu Sharma', assignedDate: today,
  dueDate: today, status: 'Pending', priority: 'Medium', notes: '',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  Low:    'bg-gray-100 text-gray-600',
  Medium: 'bg-blue-100 text-blue-700',
  High:   'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
};

const STATUS_ICONS: Record<TaskStatus, React.ReactNode> = {
  Pending:       <Circle      size={16} className="text-gray-400" />,
  'In Progress': <Clock       size={16} className="text-blue-500" />,
  Completed:     <CheckCircle2 size={16} className="text-green-500" />,
  Cancelled:     <AlertCircle  size={16} className="text-red-400" />,
};

function isOverdue(task: Task) {
  return task.status !== 'Completed' && task.status !== 'Cancelled' && task.dueDate < today;
}

export default function Tasks() {
  const { tasks, clients, leads, candidates, addTask, updateTask, deleteTask } = useCRM();
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('All');
  const [priorityFilter, setPri]    = useState('All');
  const [clientFilter, setClientF]  = useState('All');
  const [showForm, setShowForm]     = useState(false);
  const [editing, setEditing]       = useState<Task | null>(null);
  const [form, setForm]             = useState<Omit<Task, 'id' | 'createdAt'>>(EMPTY);

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    const matchSearch   = !q || t.title.toLowerCase().includes(q) ||
      (t.relatedName ?? '').toLowerCase().includes(q) ||
      (t.description ?? '').toLowerCase().includes(q);
    const matchStatus   = statusFilter === 'All' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchClient   = clientFilter === 'All' ||
      (t.relatedTo === 'Client' && t.relatedId === clientFilter);
    return matchSearch && matchStatus && matchPriority && matchClient;
  });

  const pending    = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed  = tasks.filter(t => t.status === 'Completed').length;
  const overdue    = tasks.filter(isOverdue).length;

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); }

  function openEdit(t: Task) {
    setEditing(t);
    const { id, createdAt, ...rest } = t;
    setForm(rest);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) { updateTask({ ...editing, ...form }); }
    else { addTask({ ...form, id: newId(), createdAt: today }); }
    setShowForm(false);
  }

  function quickComplete(t: Task) {
    updateTask({ ...t, status: 'Completed', completedDate: today });
  }

  function getRelatedOptions() {
    if (form.relatedTo === 'Client')    return clients.map(c => ({ id: c.id, name: c.name }));
    if (form.relatedTo === 'Lead')      return leads.map(l => ({ id: l.id, name: l.companyName }));
    if (form.relatedTo === 'Candidate') return candidates.map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }));
    return [];
  }

  return (
    <div className="space-y-4">

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 border-l-4 border-gray-300">
          <p className="text-xs text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-gray-700">{pending}</p>
        </div>
        <div className="card p-4 border-l-4 border-blue-400">
          <p className="text-xs text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-700">{inProgress}</p>
        </div>
        <div className="card p-4 border-l-4 border-green-400">
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-700">{completed}</p>
        </div>
        <div className="card p-4 border-l-4 border-red-400">
          <p className="text-xs text-gray-500">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{overdue}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..." className="input pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatus(e.target.value)} className="input w-40">
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={e => setPri(e.target.value)} className="input w-36">
          <option value="All">All Priorities</option>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={clientFilter} onChange={e => setClientF(e.target.value)} className="input w-48">
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <a
          href="https://app.clickup.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center gap-2"
          title="Open ClickUp"
        >
          <ExternalLink size={15} /> ClickUp
        </a>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* Task list */}
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <p className="text-lg mb-1">No tasks found</p>
            <p className="text-sm">Add a task using the button above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map(t => {
              const overdueTsk = isOverdue(t);
              return (
                <div key={t.id} className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors ${overdueTsk ? 'bg-red-50/40' : ''}`}>
                  <button onClick={() => t.status !== 'Completed' && quickComplete(t)}
                    className="mt-0.5 flex-shrink-0" title="Mark complete">
                    {STATUS_ICONS[t.status]}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-medium ${t.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {t.title}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[t.priority]}`}>
                        {t.priority}
                      </span>
                      {overdueTsk && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Overdue</span>
                      )}
                    </div>
                    {t.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{t.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-400">
                      {t.relatedName && (
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />
                          {t.relatedTo}: {t.relatedName}
                        </span>
                      )}
                      <span className={`${overdueTsk ? 'text-red-500 font-medium' : ''}`}>
                        Due: {t.dueDate}
                      </span>
                      {t.completedDate && <span className="text-green-600">Done: {t.completedDate}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 mt-0.5">
                    <button onClick={() => openEdit(t)} className="text-gray-400 hover:text-brand-600" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteTask(t.id)} className="text-gray-400 hover:text-red-500" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Task' : 'Add Task'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Task Title *</label>
              <input required className="input" value={form.title}
                placeholder="e.g. Follow up with TechMahindra HR"
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea rows={2} className="input resize-none" value={form.description ?? ''}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value as TaskPriority }))}>
                {PRIORITIES.map(pr => <option key={pr}>{pr}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as TaskStatus }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Related To</label>
              <select className="input" value={form.relatedTo}
                onChange={e => setForm(p => ({ ...p, relatedTo: e.target.value as TaskRelatedTo, relatedId: '', relatedName: '' }))}>
                {RELATED.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            {form.relatedTo !== 'General' && (
              <div>
                <label className="label">Select {form.relatedTo}</label>
                <select className="input" value={form.relatedId ?? ''}
                  onChange={e => {
                    const opts = getRelatedOptions();
                    const chosen = opts.find(o => o.id === e.target.value);
                    setForm(p => ({ ...p, relatedId: e.target.value, relatedName: chosen?.name ?? '' }));
                  }}>
                  <option value="">-- Select --</option>
                  {getRelatedOptions().map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="label">Contact Name <span className="text-gray-400 font-normal">(person you are following up with)</span></label>
              <input
                className="input"
                placeholder="e.g. Ramesh Patel – HR Manager"
                value={form.relatedName ?? ''}
                onChange={e => setForm(p => ({ ...p, relatedName: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Assigned To</label>
              <input className="input" value="Annu Sharma" readOnly
                style={{ background: '#f9fafb', color: '#374151' }} />
            </div>
            <div>
              <label className="label">Due Date *</label>
              <input required type="date" className="input" value={form.dueDate}
                onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
            </div>
            {form.status === 'Completed' && (
              <div>
                <label className="label">Completed Date</label>
                <input type="date" className="input" value={form.completedDate ?? today}
                  onChange={e => setForm(p => ({ ...p, completedDate: e.target.value }))} />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea rows={2} className="input resize-none" value={form.notes ?? ''}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update Task' : 'Add Task'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
