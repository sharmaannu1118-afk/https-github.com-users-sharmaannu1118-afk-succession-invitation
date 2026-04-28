import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, CheckCircle2, Circle, Clock, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react';
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

const PRIORITY_DOT: Record<TaskPriority, string> = {
  Low:    'bg-gray-400',
  Medium: 'bg-blue-500',
  High:   'bg-orange-500',
  Urgent: 'bg-red-500',
};

const PRIORITY_TEXT: Record<TaskPriority, string> = {
  Low:    'text-gray-500',
  Medium: 'text-blue-600',
  High:   'text-orange-600',
  Urgent: 'text-red-600',
};

const STATUS_CFG: Record<TaskStatus, {
  icon: React.ReactNode; textColor: string; dot: string; label: string;
}> = {
  'Pending':     { icon: <Circle size={15} />,        textColor: 'text-gray-500',  dot: 'bg-gray-400',  label: 'TO DO'       },
  'In Progress': { icon: <Clock size={15} />,         textColor: 'text-blue-500',  dot: 'bg-blue-500',  label: 'IN PROGRESS' },
  'Completed':   { icon: <CheckCircle2 size={15} />,  textColor: 'text-green-500', dot: 'bg-green-500', label: 'COMPLETE'    },
  'Cancelled':   { icon: <AlertCircle size={15} />,   textColor: 'text-red-400',   dot: 'bg-red-400',   label: 'CANCELLED'   },
};

function isOverdue(task: Task) {
  return task.status !== 'Completed' && task.status !== 'Cancelled' && task.dueDate < today;
}

function fmtDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  return `${dt.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getMonth()]}`;
}

export default function Tasks() {
  const { tasks, clients, leads, candidates, addTask, updateTask, deleteTask } = useCRM();
  const [search, setSearch]        = useState('');
  const [priorityFilter, setPri]   = useState('All');
  const [clientFilter, setClientF] = useState('All');
  const [showForm, setShowForm]    = useState(false);
  const [editing, setEditing]      = useState<Task | null>(null);
  const [form, setForm]            = useState<Omit<Task, 'id' | 'createdAt'>>(EMPTY);
  const [collapsed, setCollapsed]  = useState<Record<TaskStatus, boolean>>({
    'Pending': false, 'In Progress': false, 'Completed': true, 'Cancelled': true,
  });

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    const matchSearch   = !q || t.title.toLowerCase().includes(q) ||
      (t.relatedName ?? '').toLowerCase().includes(q) ||
      (t.description ?? '').toLowerCase().includes(q);
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchClient   = clientFilter === 'All' ||
      (t.relatedTo === 'Client' && t.relatedId === clientFilter);
    return matchSearch && matchPriority && matchClient;
  });

  const pending    = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed  = tasks.filter(t => t.status === 'Completed').length;
  const overdue    = tasks.filter(isOverdue).length;

  function openAdd(defaultStatus: TaskStatus = 'Pending') {
    setEditing(null);
    setForm({ ...EMPTY, status: defaultStatus });
    setShowForm(true);
  }

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card p-4 border-l-4 border-gray-300">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-gray-700">{pending}</p>
        </div>
        <div className="card p-4 border-l-4 border-blue-400">
          <p className="text-xs text-gray-500 uppercase tracking-wide">In Progress</p>
          <p className="text-2xl font-bold text-blue-700">{inProgress}</p>
        </div>
        <div className="card p-4 border-l-4 border-green-400">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
          <p className="text-2xl font-bold text-green-700">{completed}</p>
        </div>
        <div className="card p-4 border-l-4 border-red-400">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{overdue}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..." className="input pl-9" />
        </div>
        <select value={priorityFilter} onChange={e => setPri(e.target.value)} className="input w-36">
          <option value="All">All Priorities</option>
          {PRIORITIES.map(p => <option key={p}>{p}</option>)}
        </select>
        <select value={clientFilter} onChange={e => setClientF(e.target.value)} className="input w-44">
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={() => openAdd()} className="btn-primary sm:ml-auto">
          <Plus size={15} /> Add Task
        </button>
      </div>

      {/* ClickUp-style grouped task list */}
      <div className="card p-0 overflow-hidden border border-gray-200 rounded-lg">

        {/* Column header row */}
        <div className="hidden sm:grid px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wider"
          style={{ gridTemplateColumns: '28px 1fr 190px 110px 90px 64px' }}>
          <div />
          <div>Task Name</div>
          <div>Contact / Related</div>
          <div>Due Date</div>
          <div>Priority</div>
          <div className="text-center">Actions</div>
        </div>

        {STATUSES.map(status => {
          const group = filtered.filter(t => t.status === status);
          const isOpen = !collapsed[status];
          const cfg = STATUS_CFG[status];

          return (
            <div key={status} className="border-b border-gray-100 last:border-0">

              {/* Section header — click to collapse/expand */}
              <button
                onClick={() => setCollapsed(p => ({ ...p, [status]: !p[status] }))}
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
              >
                <span className={cfg.textColor}>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
                <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${cfg.dot}`} />
                <span className={`text-xs font-bold tracking-widest ${cfg.textColor}`}>{cfg.label}</span>
                <span className="ml-1 text-xs text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5 font-medium">{group.length}</span>
              </button>

              {/* Task rows */}
              {isOpen && (
                <>
                  {group.length === 0 && (
                    <p className="px-12 py-2.5 text-xs text-gray-400 italic border-t border-gray-50">No tasks in this section</p>
                  )}

                  {group.map(t => {
                    const od = isOverdue(t);
                    return (
                      <div
                        key={t.id}
                        className={`group border-t border-gray-50 hover:bg-blue-50/30 transition-colors ${od ? 'bg-red-50/20' : ''}`}
                      >
                        {/* Desktop row */}
                        <div className="hidden sm:grid items-center px-4 py-2.5"
                          style={{ gridTemplateColumns: '28px 1fr 190px 110px 90px 64px' }}>

                          {/* Status icon / quick-complete */}
                          <button
                            onClick={() => t.status !== 'Completed' && quickComplete(t)}
                            className={`${cfg.textColor} hover:scale-110 transition-transform`}
                            title={t.status !== 'Completed' ? 'Mark complete' : 'Completed'}
                          >
                            {cfg.icon}
                          </button>

                          {/* Task name + description */}
                          <div className="min-w-0 pr-3">
                            <p className={`text-sm font-medium truncate leading-snug ${t.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                              {t.title}
                            </p>
                            {t.description && (
                              <p className="text-xs text-gray-400 truncate leading-tight">{t.description}</p>
                            )}
                          </div>

                          {/* Contact / related */}
                          <div className="text-xs text-gray-500 truncate pr-2">
                            {t.relatedName ? (
                              <span className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                <span className="truncate">{t.relatedName}</span>
                              </span>
                            ) : <span className="text-gray-300">—</span>}
                          </div>

                          {/* Due date */}
                          <div className={`text-xs font-medium ${od ? 'text-red-500' : t.completedDate ? 'text-green-600' : 'text-gray-500'}`}>
                            {od
                              ? <span className="flex items-center gap-1"><AlertCircle size={11} />{fmtDate(t.dueDate)}</span>
                              : t.completedDate
                                ? `Done ${fmtDate(t.completedDate)}`
                                : fmtDate(t.dueDate)
                            }
                          </div>

                          {/* Priority */}
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[t.priority]}`} />
                            <span className={`text-xs font-medium ${PRIORITY_TEXT[t.priority]}`}>{t.priority}</span>
                          </div>

                          {/* Actions — visible on row hover */}
                          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(t)} className="text-gray-400 hover:text-brand-600" title="Edit"><Pencil size={13} /></button>
                            <button onClick={() => deleteTask(t.id)} className="text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={13} /></button>
                          </div>
                        </div>

                        {/* Mobile row */}
                        <div className="sm:hidden flex items-start gap-3 px-4 py-3">
                          <button
                            onClick={() => t.status !== 'Completed' && quickComplete(t)}
                            className={`mt-0.5 flex-shrink-0 ${cfg.textColor}`}
                          >
                            {cfg.icon}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${t.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>{t.title}</p>
                            {t.description && <p className="text-xs text-gray-400 truncate">{t.description}</p>}
                            <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                              {t.relatedName && <span>{t.relatedName}</span>}
                              <span className={od ? 'text-red-500 font-medium' : ''}>Due: {t.dueDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => openEdit(t)} className="text-gray-400 hover:text-brand-600"><Pencil size={13} /></button>
                            <button onClick={() => deleteTask(t.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Inline "+ Add task" per section */}
                  <button
                    onClick={() => openAdd(status)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-xs text-gray-400 hover:text-brand-600 hover:bg-gray-50 transition-colors border-t border-gray-50"
                  >
                    <Plus size={13} /> Add task
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Task' : 'New Task'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Client Name <span className="text-gray-400 font-normal">(person you are following up with)</span></label>
              <input
                className="input"
                placeholder="e.g. Ramesh Patel – HR Manager"
                value={form.relatedName ?? ''}
                onChange={e => setForm(p => ({ ...p, relatedName: e.target.value }))}
              />
            </div>
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
