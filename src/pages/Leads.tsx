import { useState, useRef } from 'react';
import { Plus, Search, Pencil, Trash2, Phone, Mail, Link2, X, MapPin, Calendar, TrendingUp, GripVertical, Download } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { exportCsv } from '../utils/exportCsv';
import type { Lead, LeadStage, LeadSource, LeadTemperature } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import LocationSelect from '../components/LocationSelect';

const STAGES: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
const SOURCES: LeadSource[] = ['Referral', 'LinkedIn', 'Naukri', 'IndiaMART', 'Justdial', 'Email Campaign', 'Cold Call', 'Website', 'Event', 'Partner', 'WhatsApp', 'Indeed', 'Direct'];
const TEMPS: LeadTemperature[] = ['Hot', 'Warm', 'Cold'];


function newId() { return 'l' + Date.now(); }
const today = new Date().toISOString().slice(0, 10);

const fmt = (n: number) =>
  n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(1)}Cr`
  : n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

const TEMP_COLORS: Record<LeadTemperature, string> = {
  Hot:  'bg-red-100 text-red-700',
  Warm: 'bg-orange-100 text-orange-700',
  Cold: 'bg-blue-100 text-blue-700',
};
const TEMP_DOT: Record<LeadTemperature, string> = {
  Hot: 'bg-red-500', Warm: 'bg-orange-400', Cold: 'bg-blue-400',
};

const STAGE_META: Record<LeadStage, { bg: string; border: string; dot: string; text: string }> = {
  'New':           { bg: 'bg-slate-50',   border: 'border-slate-200',  dot: 'bg-slate-400',   text: 'text-slate-700'  },
  'Contacted':     { bg: 'bg-cyan-50',    border: 'border-cyan-200',   dot: 'bg-cyan-500',    text: 'text-cyan-700'   },
  'Qualified':     { bg: 'bg-indigo-50',  border: 'border-indigo-200', dot: 'bg-indigo-500',  text: 'text-indigo-700' },
  'Proposal Sent': { bg: 'bg-yellow-50',  border: 'border-yellow-200', dot: 'bg-yellow-500',  text: 'text-yellow-700' },
  'Negotiation':   { bg: 'bg-orange-50',  border: 'border-orange-200', dot: 'bg-orange-500',  text: 'text-orange-700' },
  'Won':           { bg: 'bg-emerald-50', border: 'border-emerald-200',dot: 'bg-emerald-500', text: 'text-emerald-700'},
  'Lost':          { bg: 'bg-red-50',     border: 'border-red-200',    dot: 'bg-red-400',     text: 'text-red-700'    },
};

const EMPTY: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
  companyName: '', title: '', stage: 'New', source: 'Cold Call',
  temperature: 'Warm', value: 0, probability: 20,
  assignedTo: 'Annu Chelaramani', location: '', expectedCloseDate: today,
};

// Resizable TH
function ResizerTh({ children, minW = 60 }: { children: React.ReactNode; minW?: number }) {
  const thRef = useRef<HTMLTableCellElement>(null);
  const startX = useRef(0);
  const startW = useRef(0);
  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    startX.current = e.clientX;
    startW.current = thRef.current?.offsetWidth ?? 100;
    const onMove = (ev: MouseEvent) => {
      if (thRef.current) thRef.current.style.width = `${Math.max(minW, startW.current + ev.clientX - startX.current)}px`;
    };
    const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }
  return (
    <th ref={thRef} className="th relative select-none" style={{ minWidth: minW }}>
      {children}
      <span onMouseDown={onMouseDown} className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize hover:bg-brand-300 rounded" />
    </th>
  );
}

export default function Leads() {
  const { leads, clients, addLead, updateLead, deleteLead } = useCRM();
  const [search, setSearch]           = useState('');
  const [stageFilter, setStage]       = useState('All');
  const [tempFilter, setTemp]         = useState('All');
  const [locationFilter, setLocation] = useState('All');
  const [view, setView]               = useState<'board' | 'list'>('board');
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState<Lead | null>(null);
  const [viewing, setViewing]         = useState<Lead | null>(null);
  const [form, setForm]               = useState<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);
  // Drag state
  const [dragId, setDragId]           = useState<string | null>(null);
  const [dragOver, setDragOver]       = useState<LeadStage | null>(null);

  const allLocations = Array.from(new Set(leads.map(l => l.location).filter(Boolean))).sort();

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q || l.companyName.toLowerCase().includes(q) ||
      l.title.toLowerCase().includes(q) ||
      (l.contactPerson ?? '').toLowerCase().includes(q) ||
      (l.location ?? '').toLowerCase().includes(q) ||
      (l.requirement ?? '').toLowerCase().includes(q);
    return matchSearch &&
      (stageFilter === 'All' || l.stage === stageFilter) &&
      (tempFilter === 'All' || l.temperature === tempFilter) &&
      (locationFilter === 'All' || l.location === locationFilter);
  });

  const totalPipeline    = leads.filter(l => !['Won','Lost'].includes(l.stage)).reduce((s,l) => s+l.value, 0);
  const weightedPipeline = leads.filter(l => !['Won','Lost'].includes(l.stage)).reduce((s,l) => s+l.value*(l.probability/100), 0);
  const wonRevenue       = leads.filter(l => l.stage === 'Won').reduce((s,l) => s+l.value, 0);
  const hotCount         = leads.filter(l => l.temperature === 'Hot' && !['Won','Lost'].includes(l.stage)).length;

  function openAdd(stage: LeadStage = 'New') {
    setEditing(null);
    setForm({ ...EMPTY, stage });
    setShowForm(true);
  }

  function openEdit(l: Lead) {
    setEditing(l);
    const { id, createdAt, updatedAt, ...rest } = l;
    setForm(rest);
    setShowForm(true);
    setViewing(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    if (editing) updateLead({ ...editing, ...form, updatedAt: now });
    else addLead({ ...form, id: newId(), createdAt: now, updatedAt: now });
    setShowForm(false);
  }

  // Board filtered leads per stage
  function colLeads(stage: LeadStage) {
    return leads.filter(l =>
      l.stage === stage &&
      (tempFilter === 'All' || l.temperature === tempFilter) &&
      (locationFilter === 'All' || l.location === locationFilter) &&
      (!search || l.companyName.toLowerCase().includes(search.toLowerCase()) ||
        (l.contactPerson ?? '').toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Drag handlers
  function handleDragStart(e: React.DragEvent, id: string) {
    setDragId(id);
    e.dataTransfer.effectAllowed = 'move';
  }
  function handleDrop(e: React.DragEvent, stage: LeadStage) {
    e.preventDefault();
    if (dragId) {
      const lead = leads.find(l => l.id === dragId);
      if (lead && lead.stage !== stage) {
        updateLead({ ...lead, stage, updatedAt: today });
      }
    }
    setDragId(null);
    setDragOver(null);
  }

  return (
    <div className="space-y-4">

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Pipeline',    value: fmt(totalPipeline),    border: 'border-l-gray-400'   },
          { label: 'Weighted Pipeline', value: fmt(weightedPipeline), border: 'border-l-brand-500'  },
          { label: 'Won Revenue',       value: fmt(wonRevenue),       border: 'border-l-emerald-500'},
          { label: 'Hot Leads',         value: String(hotCount),      border: 'border-l-red-500'    },
        ].map(k => (
          <div key={k.label} className={`card p-4 border-l-4 ${k.border}`}>
            <p className="text-xs text-gray-500">{k.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search…" className="input pl-9 text-sm" />
        </div>
        <select value={stageFilter} onChange={e => setStage(e.target.value)} className="input w-36 text-sm">
          <option value="All">All Stages</option>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={tempFilter} onChange={e => setTemp(e.target.value)} className="input w-28 text-sm">
          <option value="All">All Temps</option>
          {TEMPS.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={locationFilter} onChange={e => setLocation(e.target.value)} className="input w-40 text-sm">
          <option value="All">All Locations</option>
          {allLocations.map(loc => <option key={loc}>{loc}</option>)}
        </select>
        <div className="flex gap-1 ml-auto">
          {(['board','list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-2 rounded-lg text-sm border capitalize ${view===v ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
              {v === 'board' ? 'Board' : 'List'}
            </button>
          ))}
          <button
            onClick={() => exportCsv('AnnuHR-Leads.csv', leads.map(l => ({
              'Company':        l.companyName,
              'Title':          l.title,
              'Stage':          l.stage,
              'Temperature':    l.temperature,
              'Contact Person': l.contactPerson ?? '',
              'Phone':          l.contactPhone ?? '',
              'Email':          l.contactEmail ?? '',
              'Location':       l.location ?? '',
              'Source':         l.source,
              'Value (₹)':      l.value,
              'Probability %':  l.probability,
              'Assigned To':    l.assignedTo,
              'Follow Up Date': l.followUpDate ?? '',
              'Close Date':     l.expectedCloseDate ?? '',
              'Requirement':    l.requirement ?? '',
              'Notes':          l.notes ?? '',
              'Created':        l.createdAt,
            })))}
            className="btn-secondary ml-1 flex items-center gap-1.5"
            title="Export Leads to CSV"
          >
            <Download size={14} /> Export CSV
          </button>
          <button onClick={() => openAdd()} className="btn-primary ml-1">
            <Plus size={15} /> Add Lead
          </button>
        </div>
      </div>

      {/* ── BOARD VIEW ─────────────────────────────────────────────────────── */}
      {view === 'board' && (
        <div className="flex gap-3 overflow-x-auto pb-4" style={{ minHeight: 520 }}>
          {STAGES.map(stage => {
            const cols = colLeads(stage);
            const { bg, border, dot, text } = STAGE_META[stage];
            const colValue = cols.reduce((s,l) => s+l.value, 0);
            const isOver = dragOver === stage;
            return (
              <div key={stage} className="flex-shrink-0 w-64 flex flex-col"
                onDragOver={e => { e.preventDefault(); setDragOver(stage); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => handleDrop(e, stage)}>
                {/* Column header */}
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-t-xl border-2 ${border} ${bg}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    <span className={`text-xs font-bold uppercase tracking-wide ${text}`}>{stage}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {colValue > 0 && <span className="text-xs text-gray-500">{fmt(colValue)}</span>}
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${bg} border ${border} ${text}`}>
                      {cols.length}
                    </span>
                  </div>
                </div>

                {/* Cards area */}
                <div className={`flex-1 border-2 border-t-0 ${border} rounded-b-xl p-2 space-y-2 transition-colors ${isOver ? 'bg-brand-50' : bg}`}
                  style={{ minHeight: 80 }}>
                  {cols.map(l => (
                    <div key={l.id}
                      draggable
                      onDragStart={e => handleDragStart(e, l.id)}
                      onDragEnd={() => { setDragId(null); setDragOver(null); }}
                      onClick={() => setViewing(l)}
                      className={`bg-white rounded-lg border border-gray-100 shadow-sm p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all select-none ${dragId === l.id ? 'opacity-40 ring-2 ring-brand-400' : ''}`}>

                      {/* Drag handle + temp */}
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <GripVertical size={13} className="text-gray-300 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{l.companyName}</p>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-bold flex-shrink-0 ${TEMP_COLORS[l.temperature]}`}>
                          {l.temperature[0]}
                        </span>
                      </div>

                      {/* Requirement */}
                      {l.requirement && (
                        <p className="text-xs text-gray-400 mb-2 truncate">{l.requirement}</p>
                      )}

                      {/* Contact */}
                      {l.contactPerson && (
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {l.contactPerson[0]}
                          </div>
                          <span className="text-xs text-gray-600 truncate">{l.contactPerson}</span>
                        </div>
                      )}

                      {/* Tags row */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {l.location && (
                          <span className="flex items-center gap-0.5 text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                            <MapPin size={9} />{l.location}
                          </span>
                        )}
                        {l.followUpDate && (
                          <span className="flex items-center gap-0.5 text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                            <Calendar size={9} />{l.followUpDate}
                          </span>
                        )}
                      </div>

                      {/* Value + probability */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-700">{fmt(l.value)}</span>
                        <span className="text-xs text-gray-400">{l.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                        <div className="bg-brand-500 h-1 rounded-full" style={{ width: `${l.probability}%` }} />
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 mt-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEdit(l)} className="text-gray-300 hover:text-brand-600 transition-colors"><Pencil size={12} /></button>
                        <button onClick={() => deleteLead(l.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  ))}

                  {/* Quick add per column */}
                  <button onClick={() => openAdd(stage)}
                    className="w-full text-left text-xs text-gray-400 hover:text-brand-600 hover:bg-white rounded-lg px-2 py-1.5 border border-dashed border-gray-200 hover:border-brand-300 transition-all flex items-center gap-1.5 mt-1">
                    <Plus size={12} /> Add card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LIST VIEW ──────────────────────────────────────────────────────── */}
      {view === 'list' && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr>
                  <ResizerTh minW={50}>Lead #</ResizerTh>
                  <ResizerTh minW={120}>Company</ResizerTh>
                  <ResizerTh minW={120}>Contact</ResizerTh>
                  <ResizerTh minW={120}>Requirement</ResizerTh>
                  <ResizerTh minW={65}>Temp</ResizerTh>
                  <ResizerTh minW={100}>Stage</ResizerTh>
                  <ResizerTh minW={80}>Value</ResizerTh>
                  <ResizerTh minW={100}>Location</ResizerTh>
                  <ResizerTh minW={90}>Follow-up</ResizerTh>
                  <th className="th w-16"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="td text-center text-gray-400 py-10">No leads found.</td></tr>
                ) : filtered.map((l, idx) => (
                  <tr key={l.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setViewing(l)}>
                    <td className="td text-xs font-semibold text-gray-400">#{idx+1}</td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${TEMP_DOT[l.temperature]}`} />
                        <p className="font-semibold text-gray-900 text-sm truncate">{l.companyName}</p>
                      </div>
                    </td>
                    <td className="td">
                      {l.contactPerson && <p className="text-sm text-gray-700 truncate">{l.contactPerson}</p>}
                      {l.contactPhone && (
                        <a href={`tel:${l.contactPhone}`} onClick={e => e.stopPropagation()}
                          className="text-xs text-gray-400 flex items-center gap-1 hover:text-brand-600 truncate">
                          <Phone size={10} />{l.contactPhone}
                        </a>
                      )}
                    </td>
                    <td className="td text-xs text-gray-500 truncate">{l.requirement ?? '—'}</td>
                    <td className="td">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TEMP_COLORS[l.temperature]}`}>{l.temperature}</span>
                    </td>
                    <td className="td"><StatusBadge value={l.stage} /></td>
                    <td className="td font-semibold text-brand-700 text-sm">{fmt(l.value)}</td>
                    <td className="td text-xs text-gray-500 truncate">{l.location}</td>
                    <td className="td text-xs text-gray-500">{l.followUpDate ?? l.expectedCloseDate}</td>
                    <td className="td" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(l)} className="text-gray-400 hover:text-brand-600"><Pencil size={14} /></button>
                        <button onClick={() => deleteLead(l.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DETAIL POPUP ───────────────────────────────────────────────────── */}
      {viewing && (() => {
        const { dot } = STAGE_META[viewing.stage];
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-brand-600 to-indigo-600 rounded-t-2xl p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                      <span className="text-xs uppercase tracking-wider text-white/70">{viewing.stage}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${TEMP_COLORS[viewing.temperature]}`}>{viewing.temperature}</span>
                    </div>
                    <h2 className="text-xl font-bold truncate">{viewing.companyName}</h2>
                    {viewing.title && <p className="text-sm text-white/70 mt-0.5 truncate">{viewing.title}</p>}
                  </div>
                  <button onClick={() => setViewing(null)} className="text-white/70 hover:text-white ml-4 flex-shrink-0"><X size={20} /></button>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div><p className="text-xs text-white/60">Deal Value</p><p className="text-lg font-bold">{fmt(viewing.value)}</p></div>
                  <div><p className="text-xs text-white/60">Probability</p><p className="text-lg font-bold">{viewing.probability}%</p></div>
                  {viewing.location && (
                    <div className="ml-auto flex items-center gap-1 text-sm text-white/80"><MapPin size={14} />{viewing.location}</div>
                  )}
                </div>
                <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                  <div className="bg-white h-1.5 rounded-full" style={{ width: `${viewing.probability}%` }} />
                </div>
              </div>
              <div className="p-6 space-y-3">
                {(viewing.contactPerson || viewing.contactPhone || viewing.contactEmail || viewing.linkedin) && (
                  <div className="rounded-xl border border-gray-100 overflow-hidden">
                    {viewing.contactPerson && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {viewing.contactPerson[0]}
                        </div>
                        <div><p className="text-xs text-gray-400">Contact Person</p><p className="text-sm font-semibold text-gray-900">{viewing.contactPerson}</p></div>
                      </div>
                    )}
                    {viewing.contactPhone && (
                      <a href={`tel:${viewing.contactPhone}`} className="flex items-center gap-3 p-3 border-t border-gray-100 hover:bg-green-50 transition-colors">
                        <Phone size={16} className="text-green-500 flex-shrink-0" />
                        <div><p className="text-xs text-gray-400">Phone</p><p className="text-sm font-medium text-gray-800">{viewing.contactPhone}</p></div>
                      </a>
                    )}
                    {viewing.contactEmail && (
                      <a href={`mailto:${viewing.contactEmail}`} className="flex items-center gap-3 p-3 border-t border-gray-100 hover:bg-blue-50 transition-colors">
                        <Mail size={16} className="text-blue-500 flex-shrink-0" />
                        <div><p className="text-xs text-gray-400">Email</p><p className="text-sm font-medium text-gray-800">{viewing.contactEmail}</p></div>
                      </a>
                    )}
                    {viewing.linkedin && (
                      <a href={viewing.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border-t border-gray-100 hover:bg-blue-50 transition-colors">
                        <Link2 size={16} className="text-blue-600 flex-shrink-0" />
                        <div><p className="text-xs text-gray-400">LinkedIn</p><p className="text-sm font-medium text-blue-600 truncate">{viewing.linkedin}</p></div>
                      </a>
                    )}
                    {viewing.website && (
                      <a href={viewing.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 border-t border-gray-100 hover:bg-purple-50 transition-colors">
                        <Link2 size={16} className="text-purple-600 flex-shrink-0" />
                        <div><p className="text-xs text-gray-400">Website</p><p className="text-sm font-medium text-purple-600 truncate">{viewing.website}</p></div>
                      </a>
                    )}
                  </div>
                )}
                {viewing.requirement && (
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-medium mb-1">Requirement</p>
                    <p className="text-sm text-gray-700">{viewing.requirement}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={11} />Expected Close</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">{viewing.expectedCloseDate}</p>
                  </div>
                  {viewing.followUpDate && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-600 flex items-center gap-1"><Calendar size={11} />Follow-up</p>
                      <p className="text-sm font-medium text-gray-800 mt-0.5">{viewing.followUpDate}</p>
                    </div>
                  )}
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp size={11} />Source</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">{viewing.source}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400">Assigned To</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">{viewing.assignedTo}</p>
                  </div>
                </div>
                {viewing.notes && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs text-amber-600 font-medium mb-1">Notes</p>
                    <p className="text-sm text-gray-700">{viewing.notes}</p>
                  </div>
                )}
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button onClick={() => openEdit(viewing)} className="flex-1 btn-primary justify-center"><Pencil size={14} />Edit Lead</button>
                <button onClick={() => setViewing(null)} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── FORM MODAL ─────────────────────────────────────────────────────── */}
      {showForm && (
        <Modal title={editing ? 'Edit Lead' : 'Add Lead'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Company Name *</label>
              <input required className="input" placeholder="e.g. Tech Mahindra Ltd"
                value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} /></div>
            <div><label className="label">Lead Title *</label>
              <input required className="input" placeholder="e.g. HR Manager hiring"
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
            <div><label className="label">Contact Person</label>
              <input className="input" value={form.contactPerson ?? ''} onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} /></div>
            <div><label className="label">Contact Phone</label>
              <input className="input" type="tel" value={form.contactPhone ?? ''} onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))} /></div>
            <div><label className="label">Contact Email</label>
              <input className="input" type="email" value={form.contactEmail ?? ''} onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))} /></div>
            <div><label className="label">LinkedIn URL</label>
              <input className="input" placeholder="https://linkedin.com/in/..."
                value={form.linkedin ?? ''} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} /></div>
            <div><label className="label">Company Website</label>
              <input className="input" placeholder="https://www.company.com"
                value={form.website ?? ''} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} /></div>
            <div><label className="label">Location</label>
              <LocationSelect value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))} /></div>
            <div className="sm:col-span-2"><label className="label">Requirement</label>
              <input className="input" placeholder="e.g. Permanent staffing – 5 engineers"
                value={form.requirement ?? ''} onChange={e => setForm(p => ({ ...p, requirement: e.target.value }))} /></div>
            <div><label className="label">Temperature</label>
              <div className="flex gap-2">
                {TEMPS.map(t => (
                  <button key={t} type="button" onClick={() => setForm(p => ({ ...p, temperature: t }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.temperature === t
                        ? t==='Hot' ? 'bg-red-500 text-white border-red-500'
                          : t==='Warm' ? 'bg-orange-400 text-white border-orange-400'
                          : 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-600 border-gray-300'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div><label className="label">Stage</label>
              <select className="input" value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value as LeadStage }))}>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select></div>
            <div><label className="label">Source</label>
              <select className="input" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value as LeadSource }))}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select></div>
            <div><label className="label">Linked Client</label>
              <select className="input" value={form.clientId ?? ''} onChange={e => setForm(p => ({ ...p, clientId: e.target.value || undefined }))}>
                <option value="">-- None --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            <div><label className="label">Deal Value (₹)</label>
              <input type="number" className="input" value={form.value} onChange={e => setForm(p => ({ ...p, value: +e.target.value }))} /></div>
            <div><label className="label">Probability (%)</label>
              <input type="number" min="0" max="100" className="input" value={form.probability} onChange={e => setForm(p => ({ ...p, probability: +e.target.value }))} /></div>
            <div><label className="label">Assigned To</label>
              <input className="input" value="Annu Chelaramani" readOnly style={{ background:'#f9fafb', color:'#374151' }} /></div>
            <div><label className="label">Expected Close Date</label>
              <input type="date" className="input" value={form.expectedCloseDate} onChange={e => setForm(p => ({ ...p, expectedCloseDate: e.target.value }))} /></div>
            <div><label className="label">Follow-up Date</label>
              <input type="date" className="input" value={form.followUpDate ?? ''} onChange={e => setForm(p => ({ ...p, followUpDate: e.target.value }))} /></div>
            <div className="sm:col-span-2"><label className="label">Notes</label>
              <textarea rows={2} className="input resize-none" value={form.notes ?? ''} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update Lead' : 'Add Lead'}</button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
