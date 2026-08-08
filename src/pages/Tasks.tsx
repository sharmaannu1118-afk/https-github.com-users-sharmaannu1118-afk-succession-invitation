import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, CheckCircle2, Circle, Clock, AlertCircle, ChevronRight, ChevronDown, Calendar, User, Tag, FileText, X, Download, FilePen, Bell, RefreshCw, Copy } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { exportCsv } from '../utils/exportCsv';
import type { Task, TaskStatus, TaskPriority, TaskRelatedTo, RecurringType } from '../types';
import Modal from '../components/Modal';

function newId() { return 't' + Date.now(); }
const today = new Date().toISOString().slice(0, 10);

const STATUSES: TaskStatus[] = ['Draft', 'Not Started', 'Pending', 'In Progress', 'Under Review', 'On Hold', 'Blocked', 'Incomplete', 'Completed'];
const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
const RELATED: TaskRelatedTo[]  = ['Client', 'Lead', 'Candidate', 'General'];
const RECURRING_OPTIONS: RecurringType[] = ['None', 'Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Yearly'];

const EMPTY: Omit<Task, 'id' | 'createdAt'> = {
  title: '', description: '', relatedTo: 'General', relatedId: '',
  relatedName: '', assignedTo: 'Annu Chelaramani', assignedDate: today,
  dueDate: today, status: 'Pending', priority: 'Medium', notes: '',
  reminderDate: '', reminderTime: '', recurring: 'None', recurringEndDate: '',
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

const PRIORITY_BG: Record<TaskPriority, string> = {
  Low:    'bg-gray-100 text-gray-600',
  Medium: 'bg-blue-100 text-blue-700',
  High:   'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
};

const STATUS_CFG: Record<TaskStatus, {
  icon: React.ReactNode; textColor: string; dot: string; label: string; bg: string;
}> = {
  'Draft':         { icon: <FilePen size={15} />,       textColor: 'text-slate-400',  dot: 'bg-slate-300',  label: 'DRAFT',        bg: 'bg-slate-100 text-slate-500'  },
  'Not Started':   { icon: <Circle size={15} />,        textColor: 'text-gray-400',   dot: 'bg-gray-300',   label: 'NOT STARTED',  bg: 'bg-gray-100 text-gray-500'    },
  'Pending':       { icon: <Circle size={15} />,        textColor: 'text-gray-500',   dot: 'bg-gray-400',   label: 'PENDING',      bg: 'bg-gray-100 text-gray-600'    },
  'In Progress':   { icon: <Clock size={15} />,         textColor: 'text-blue-500',   dot: 'bg-blue-500',   label: 'IN PROGRESS',  bg: 'bg-blue-100 text-blue-700'    },
  'Under Review':  { icon: <Clock size={15} />,         textColor: 'text-purple-500', dot: 'bg-purple-500', label: 'UNDER REVIEW', bg: 'bg-purple-100 text-purple-700'},
  'On Hold':       { icon: <AlertCircle size={15} />,   textColor: 'text-yellow-600', dot: 'bg-yellow-400', label: 'ON HOLD',      bg: 'bg-yellow-100 text-yellow-700'},
  'Blocked':       { icon: <AlertCircle size={15} />,   textColor: 'text-red-500',    dot: 'bg-red-500',    label: 'BLOCKED',      bg: 'bg-red-100 text-red-700'      },
  'Incomplete':    { icon: <AlertCircle size={15} />,   textColor: 'text-orange-500', dot: 'bg-orange-400', label: 'INCOMPLETE',   bg: 'bg-orange-100 text-orange-700'},
  'Completed':     { icon: <CheckCircle2 size={15} />,  textColor: 'text-green-500',  dot: 'bg-green-500',  label: 'COMPLETE',     bg: 'bg-green-100 text-green-700'  },
};

function isOverdue(task: Task) {
  return task.status !== 'Completed' && task.dueDate < today;
}

function fmtDate(d: string) {
  const dt = new Date(d + 'T00:00:00');
  return `${dt.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getMonth()]} ${dt.getFullYear()}`;
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <div className="text-sm text-gray-800">{value}</div>
      </div>
    </div>
  );
}

export default function Tasks() {
  const { tasks, clients, contacts, leads, candidates, addTask, updateTask, deleteTask } = useCRM();

  function duplicateTask(t: Task) {
    const today = new Date().toISOString().slice(0, 10);
    addTask({ ...t, id: 'tsk' + Date.now(), title: t.title + ' (Copy)', status: 'Pending', completedDate: undefined, createdAt: today });
  }
  const [search, setSearch]        = useState('');
  const [priorityFilter, setPri]   = useState('All');
  const [clientFilter, setClientF] = useState('All');
  const [showForm, setShowForm]    = useState(false);
  const [editing, setEditing]      = useState<Task | null>(null);
  const [form, setForm]            = useState<Omit<Task, 'id' | 'createdAt'>>(EMPTY);
  const [viewTask, setViewTask]    = useState<Task | null>(null);
  const [overdueOpen, setOverdueOpen] = useState(true);
  const [collapsed, setCollapsed]  = useState<Record<TaskStatus, boolean>>({
    'Draft': true, 'Not Started': false, 'Pending': false, 'In Progress': false,
    'Under Review': false, 'On Hold': true, 'Blocked': true,
    'Incomplete': true, 'Completed': true,
  });

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    const matchSearch   = !q || t.title.toLowerCase().includes(q) ||
      (t.relatedName ?? '').toLowerCase().includes(q) ||
      (t.description ?? '').toLowerCase().includes(q);
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchClient = clientFilter === 'All' || (() => {
      if (t.companyId === clientFilter) return true;
      if (t.relatedTo === 'Client' && t.relatedId === clientFilter) return true;
      const client = clients.find(c => c.id === clientFilter);
      if (!client) return false;
      if (t.relatedName === client.name) return true;
      return contacts
        .filter(c => c.clientId === clientFilter)
        .some(c => {
          const full = `${c.firstName} ${c.lastName}`.trim();
          return t.relatedName === full || t.relatedName === c.firstName;
        });
    })();
    return matchSearch && matchPriority && matchClient;
  });

  const drafts      = tasks.filter(t => t.status === 'Draft').length;
  const pending     = tasks.filter(t => t.status === 'Pending').length;
  const inProgress  = tasks.filter(t => t.status === 'In Progress').length;
  const completed   = tasks.filter(t => t.status === 'Completed').length;
  const overdue     = tasks.filter(isOverdue).length;
  const onHold      = tasks.filter(t => t.status === 'On Hold').length;
  const blocked     = tasks.filter(t => t.status === 'Blocked').length;
  const underReview = tasks.filter(t => t.status === 'Under Review').length;
  const incomplete  = tasks.filter(t => t.status === 'Incomplete').length;

  function openAdd(defaultStatus: TaskStatus = 'Pending') {
    setEditing(null);
    setForm({ ...EMPTY, status: defaultStatus });
    setShowForm(true);
  }

  function openEdit(t: Task) {
    setEditing(t);
    const { id, createdAt, ...rest } = t;

    // Resolve companyId: direct → relatedId (if Client) → match relatedName against clients
    let companyId = rest.companyId ?? '';
    if (!companyId) {
      if (rest.relatedTo === 'Client' && rest.relatedId) {
        companyId = rest.relatedId;
      } else if (rest.relatedName) {
        companyId = clients.find(c => c.name === rest.relatedName)?.id ?? '';
      }
    }

    // Resolve relatedId: if Client and missing, use companyId
    let relatedId = rest.relatedId ?? '';
    if (!relatedId && rest.relatedTo === 'Client' && companyId) {
      relatedId = companyId;
    }

    // Resolve relatedName: if missing but companyId found
    let relatedName = rest.relatedName ?? '';
    if (!relatedName && companyId) {
      relatedName = clients.find(c => c.id === companyId)?.name ?? '';
    }

    // Resolve contactId: direct → match by name in contacts for this company
    let contactId = rest.contactId ?? '';
    if (!contactId && companyId && relatedName) {
      const found = contacts.find(c =>
        c.clientId === companyId &&
        (`${c.firstName} ${c.lastName}`.trim() === relatedName || c.firstName === relatedName)
      );
      if (found) contactId = found.id;
    }

    setForm({ ...rest, companyId, contactId, relatedId, relatedName });
    setViewTask(null);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) { updateTask({ ...editing, ...form }); }
    else { addTask({ ...form, id: newId(), createdAt: today }); }
    setShowForm(false);
  }

  function handleCloseForm() {
    // Auto-save as Draft if user typed a title but didn't submit (new task only)
    if (!editing && form.title.trim()) {
      addTask({ ...form, id: newId(), createdAt: today, status: 'Draft' });
      setCollapsed(p => ({ ...p, Draft: false }));
    }
    setShowForm(false);
  }

  function quickComplete(t: Task) {
    const updated = { ...t, status: 'Completed' as TaskStatus, completedDate: today };
    updateTask(updated);
    if (viewTask?.id === t.id) setViewTask(updated);
  }

  function handleDelete(id: string, title?: string) {
    if (!window.confirm(`Delete task "${title ?? 'this task'}"? This cannot be undone.`)) return;
    deleteTask(id);
    setViewTask(null);
  }

  function getRelatedOptions() {
    if (form.relatedTo === 'Client')    return clients.map(c => ({ id: c.id, name: c.name }));
    if (form.relatedTo === 'Lead')      return leads.map(l => ({ id: l.id, name: l.companyName }));
    if (form.relatedTo === 'Candidate') return candidates.map(c => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }));
    return [];
  }

  return (
    <div className="space-y-4">

      {/* Summary cards — all 9 status counts (inline styles to bypass CSS cache) */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
        {[
          { label:'Draft',        count: drafts,      accent:'#94a3b8', numColor:'#475569' },
          { label:'Pending',      count: pending,     accent:'#9ca3af', numColor:'#374151' },
          { label:'In Progress',  count: inProgress,  accent:'#60a5fa', numColor:'#2563eb' },
          { label:'Completed',    count: completed,   accent:'#4ade80', numColor:'#16a34a' },
          { label:'Overdue',      count: overdue,     accent:'#f87171', numColor:'#dc2626' },
          { label:'On Hold',      count: onHold,      accent:'#facc15', numColor:'#ca8a04' },
          { label:'Blocked',      count: blocked,     accent:'#ef4444', numColor:'#b91c1c' },
          { label:'Under Review', count: underReview, accent:'#c084fc', numColor:'#9333ea' },
          { label:'Incomplete',   count: incomplete,  accent:'#fb923c', numColor:'#ea580c' },
        ].map(({ label, count, accent, numColor }) => (
          <div key={label} style={{
            background:'#fff', borderRadius:'12px', padding:'12px 14px',
            border:`1px solid #e5e7eb`, borderLeft:`4px solid ${accent}`,
            boxShadow:'0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize:'10px', fontWeight:600, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'4px' }}>{label}</p>
            <p style={{ fontSize:'22px', fontWeight:700, color: numColor, margin:0 }}>{count}</p>
          </div>
        ))}
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
        <button
          onClick={() => exportCsv('AnnuHR-Tasks.csv', tasks.map(t => ({
            'Title':          t.title,
            'Description':    t.description ?? '',
            'Status':         t.status,
            'Priority':       t.priority,
            'Client Name':    t.relatedName ?? '',
            'Related To':     t.relatedTo,
            'Assigned To':    t.assignedTo,
            'Due Date':       t.dueDate,
            'Completed Date': t.completedDate ?? '',
            'Notes':          t.notes ?? '',
            'Created':        t.createdAt,
          })))}
          className="btn-secondary flex items-center gap-1.5"
          title="Export Tasks to CSV"
        >
          <Download size={14} /> Export CSV
        </button>
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

        {/* ── Overdue section — pinned at top, auto-populated by due date ── */}
        {(() => {
          const overdueGroup = filtered.filter(isOverdue);
          if (overdueGroup.length === 0) return null;
          return (
            <div className="border-b border-red-100 bg-red-50/30">
              <button
                onClick={() => setOverdueOpen(p => !p)}
                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 transition-colors text-left"
              >
                <span className="text-red-500">
                  {overdueOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0 bg-red-500" />
                <span className="text-xs font-bold tracking-widest text-red-500">OVERDUE</span>
                <span className="ml-1 text-xs font-semibold text-red-500 bg-red-100 border border-red-200 rounded-full px-1.5 py-0.5">{overdueGroup.length}</span>
                <span className="text-xs text-red-400 ml-1">· past due date, not completed</span>
              </button>

              {overdueOpen && (
                <>
                  {overdueGroup.map(t => {
                    return (
                      <div
                        key={t.id}
                        className="group border-t border-red-100 hover:bg-red-50/60 transition-colors cursor-pointer bg-red-50/20"
                        onClick={() => setViewTask(t)}
                      >
                        {/* Desktop row */}
                        <div className="hidden sm:grid items-center px-4 py-2.5"
                          style={{ gridTemplateColumns: '28px 1fr 190px 110px 90px 64px' }}>
                          <button
                            onClick={e => { e.stopPropagation(); quickComplete(t); }}
                            className="text-red-400 hover:scale-110 transition-transform"
                            title="Mark complete"
                          >
                            <AlertCircle size={15} />
                          </button>
                          <div className="min-w-0 pr-3">
                            <p className="text-sm font-medium truncate leading-snug text-gray-800">{t.title}</p>
                            {t.description && <p className="text-xs text-gray-400 truncate leading-tight">{t.description}</p>}
                          </div>
                          <div className="text-xs text-gray-500 truncate pr-2">
                            {t.relatedName
                              ? <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-400" /><span className="truncate">{t.relatedName}</span></span>
                              : <span className="text-gray-300">—</span>}
                          </div>
                          <div className="text-xs font-semibold text-red-500 flex items-center gap-1">
                            <AlertCircle size={11} />{fmtDate(t.dueDate)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[t.priority]}`} />
                            <span className={`text-xs font-medium ${PRIORITY_TEXT[t.priority]}`}>{t.priority}</span>
                          </div>
                          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={e => { e.stopPropagation(); openEdit(t); }} className="text-gray-400 hover:text-brand-600" title="Edit"><Pencil size={13} /></button>
                            <button onClick={e => { e.stopPropagation(); duplicateTask(t); }} className="text-gray-400 hover:text-indigo-500" title="Duplicate"><Copy size={13} /></button>
                            <button onClick={e => { e.stopPropagation(); handleDelete(t.id, t.title); }} className="text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={13} /></button>
                          </div>
                        </div>

                        {/* Mobile row */}
                        <div className="sm:hidden flex items-start gap-3 px-4 py-3">
                          <button onClick={e => { e.stopPropagation(); quickComplete(t); }} className="mt-0.5 flex-shrink-0 text-red-400">
                            <AlertCircle size={15} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800">{t.title}</p>
                            {t.description && <p className="text-xs text-gray-400 truncate">{t.description}</p>}
                            <div className="flex flex-wrap gap-2 mt-1 text-xs">
                              {t.relatedName && <span className="text-gray-400">{t.relatedName}</span>}
                              <span className="text-red-500 font-semibold">Overdue: {t.dueDate}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={e => { e.stopPropagation(); openEdit(t); }} className="text-gray-400 hover:text-brand-600"><Pencil size={13} /></button>
                            <button onClick={e => { e.stopPropagation(); duplicateTask(t); }} className="text-gray-400 hover:text-indigo-500"><Copy size={13} /></button>
                            <button onClick={e => { e.stopPropagation(); handleDelete(t.id, t.title); }} className="text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })()}

        {STATUSES.map(status => {
          // Exclude overdue tasks from their status group (they live in the Overdue section above)
          const group = filtered.filter(t => t.status === status && !isOverdue(t));
          const isOpen = !collapsed[status];
          const cfg = STATUS_CFG[status];

          return (
            <div key={status} className="border-b border-gray-100 last:border-0">

              {/* Section header */}
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
                        className={`group border-t border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer ${od ? 'bg-red-50/20' : ''}`}
                        onClick={() => setViewTask(t)}
                      >
                        {/* Desktop row */}
                        <div className="hidden sm:grid items-center px-4 py-2.5"
                          style={{ gridTemplateColumns: '28px 1fr 190px 110px 90px 64px' }}>

                          {/* Status icon / quick-complete */}
                          <button
                            onClick={e => { e.stopPropagation(); t.status !== 'Completed' && quickComplete(t); }}
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
                            <button onClick={e => { e.stopPropagation(); openEdit(t); }} className="text-gray-400 hover:text-brand-600" title="Edit"><Pencil size={13} /></button>
                            <button onClick={e => { e.stopPropagation(); duplicateTask(t); }} className="text-gray-400 hover:text-indigo-500" title="Duplicate"><Copy size={13} /></button>
                            <button onClick={e => { e.stopPropagation(); handleDelete(t.id, t.title); }} className="text-gray-400 hover:text-red-500" title="Delete"><Trash2 size={13} /></button>
                          </div>
                        </div>

                        {/* Mobile row */}
                        <div className="sm:hidden flex items-start gap-3 px-4 py-3">
                          <button
                            onClick={e => { e.stopPropagation(); t.status !== 'Completed' && quickComplete(t); }}
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
                            <button onClick={e => { e.stopPropagation(); openEdit(t); }} className="text-gray-400 hover:text-brand-600"><Pencil size={13} /></button>
                            <button onClick={e => { e.stopPropagation(); duplicateTask(t); }} className="text-gray-400 hover:text-indigo-500"><Copy size={13} /></button>
                            <button onClick={e => { e.stopPropagation(); handleDelete(t.id, t.title); }} className="text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
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

      {/* ── Task Detail Modal ── */}
      {viewTask && (() => {
        const t = viewTask;
        const cfg = STATUS_CFG[t.status];
        const od = isOverdue(t);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setViewTask(null)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                  <p className={`text-lg font-semibold leading-snug ${t.status === 'Completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {t.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg}`}>
                      {cfg.icon} {cfg.label}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${PRIORITY_BG[t.priority]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[t.priority]}`} />
                      {t.priority}
                    </span>
                    {od && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                        <AlertCircle size={11} /> Overdue
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => setViewTask(null)} className="text-gray-400 hover:text-gray-600 flex-shrink-0 mt-0.5">
                  <X size={18} />
                </button>
              </div>

              {/* Detail rows */}
              <div className="px-6 py-3">
                {t.companyId && <DetailRow icon={<User size={14} />} label="Company Name" value={clients.find(c => c.id === t.companyId)?.name} />}
                {t.contactId && <DetailRow icon={<User size={14} />} label="Client Name" value={(() => { const ct = contacts.find(c => c.id === t.contactId); return ct ? `${ct.firstName} ${ct.lastName}`.trim() : undefined; })()} />}
                {!t.companyId && !t.contactId && t.relatedName && <DetailRow icon={<User size={14} />} label="Client Name" value={t.relatedName} />}
                <DetailRow icon={<FileText size={14} />} label="Description" value={t.description || undefined} />
                <DetailRow icon={<Tag size={14} />} label="Related To"
                  value={t.relatedTo !== 'General' && t.relatedName ? `${t.relatedTo}: ${t.relatedName}` : t.relatedTo} />
                <DetailRow icon={<User size={14} />} label="Assigned To" value={t.assignedTo} />
                <DetailRow icon={<Calendar size={14} />} label="Due Date"
                  value={<span className={od ? 'text-red-500 font-medium' : ''}>{fmtDate(t.dueDate)}</span>} />
                {t.completedDate && (
                  <DetailRow icon={<CheckCircle2 size={14} />} label="Completed Date"
                    value={<span className="text-green-600">{fmtDate(t.completedDate)}</span>} />
                )}
                {t.createdAt && (
                  <DetailRow icon={<Calendar size={14} />} label="Created On" value={fmtDate(t.createdAt)} />
                )}
                {t.notes && (
                  <div className="py-2.5 border-b border-gray-50">
                    <p className="text-xs text-gray-400 mb-1">Notes</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{t.notes}</p>
                  </div>
                )}
                {t.reminderDate && (
                  <DetailRow
                    icon={<Bell size={14} />}
                    label="Reminder"
                    value={`${fmtDate(t.reminderDate)}${t.reminderTime ? ' at ' + t.reminderTime : ''}`}
                  />
                )}
                {t.recurring && t.recurring !== 'None' && (
                  <DetailRow
                    icon={<RefreshCw size={14} />}
                    label="Recurring"
                    value={t.recurringEndDate ? `${t.recurring} · ends ${fmtDate(t.recurringEndDate)}` : t.recurring}
                  />
                )}
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                <div className="flex gap-2">
                  {t.status !== 'Completed' && (
                    <button
                      onClick={() => quickComplete(t)}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} /> Mark Complete
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(t)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => { duplicateTask(t); setViewTask(null); }}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Copy size={13} /> Duplicate
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(t.id, t.title)}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1.5 font-medium"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Task Form Modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Task' : 'New Task'} onClose={handleCloseForm}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Company Name</label>
              <select className="input" value={form.companyId ?? ''}
                onChange={e => {
                  const c = clients.find(cl => cl.id === e.target.value);
                  setForm(p => ({ ...p, companyId: e.target.value, relatedTo: 'Client', relatedId: e.target.value, relatedName: c?.name ?? '', contactId: '' }));
                }}>
                <option value="">-- Select Company --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Client Name</label>
              <select className="input" value={form.contactId ?? ''}
                onChange={e => {
                  const ct = contacts.find(c => c.id === e.target.value);
                  setForm(p => ({ ...p, contactId: e.target.value, relatedName: ct ? ct.firstName : (p.relatedName ?? '') }));
                }}>
                <option value="">-- Select Contact --</option>
                {contacts
                  .filter(ct => !form.companyId || ct.clientId === form.companyId)
                  .map(ct => <option key={ct.id} value={ct.id}>{ct.firstName} {ct.lastName}</option>)}
              </select>
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
              <input className="input" value="Annu Chelaramani" readOnly
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
            {/* ── Reminder ── */}
            <div className="sm:col-span-2">
              <label className="label flex items-center gap-1.5"><Bell size={13} className="text-brand-500" /> Reminder</label>
              <div className="flex gap-2">
                <input type="date" className="input flex-1" value={form.reminderDate ?? ''}
                  onChange={e => setForm(p => ({ ...p, reminderDate: e.target.value }))}
                  placeholder="Reminder date" />
                <input type="time" className="input w-36" value={form.reminderTime ?? ''}
                  onChange={e => setForm(p => ({ ...p, reminderTime: e.target.value }))} />
              </div>
            </div>

            {/* ── Recurring ── */}
            <div>
              <label className="label flex items-center gap-1.5"><RefreshCw size={13} className="text-brand-500" /> Recurring</label>
              <select className="input" value={form.recurring ?? 'None'}
                onChange={e => setForm(p => ({ ...p, recurring: e.target.value as RecurringType, recurringEndDate: e.target.value === 'None' ? '' : p.recurringEndDate }))}>
                {RECURRING_OPTIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            {form.recurring && form.recurring !== 'None' && (
              <div>
                <label className="label">Recurring End Date</label>
                <input type="date" className="input" value={form.recurringEndDate ?? ''}
                  onChange={e => setForm(p => ({ ...p, recurringEndDate: e.target.value }))} />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea rows={2} className="input resize-none" value={form.notes ?? ''}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={handleCloseForm} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update Task' : 'Add Task'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
