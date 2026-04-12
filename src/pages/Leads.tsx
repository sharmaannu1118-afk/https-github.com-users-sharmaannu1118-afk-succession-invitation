import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Phone, Mail } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Lead, LeadStage, LeadSource, LeadTemperature } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const STAGES: LeadStage[] = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
const SOURCES: LeadSource[] = ['Referral', 'LinkedIn', 'Naukri', 'IndiaMART', 'Justdial', 'Email Campaign', 'Cold Call', 'Website', 'Event', 'Partner', 'WhatsApp'];
const TEMPS: LeadTemperature[] = ['Hot', 'Warm', 'Cold'];
const TEAM = ['Annu Sharma', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];

function newId() { return 'l' + Date.now(); }

const fmt = (n: number) =>
  n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(1)}Cr`
  : n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

const TEMP_COLORS: Record<LeadTemperature, string> = {
  Hot:  'bg-red-100 text-red-700',
  Warm: 'bg-orange-100 text-orange-700',
  Cold: 'bg-blue-100 text-blue-700',
};

const EMPTY: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
  companyName: '', title: '', stage: 'New', source: 'Cold Call',
  temperature: 'Warm', value: 0, probability: 20,
  assignedTo: 'Annu Sharma', location: '', expectedCloseDate: new Date().toISOString().slice(0, 10),
};

const STAGE_COLORS: Record<LeadStage, string> = {
  New: 'border-blue-300 bg-blue-50',
  Contacted: 'border-cyan-300 bg-cyan-50',
  Qualified: 'border-indigo-300 bg-indigo-50',
  'Proposal Sent': 'border-yellow-300 bg-yellow-50',
  Negotiation: 'border-orange-300 bg-orange-50',
  Won: 'border-green-300 bg-green-50',
  Lost: 'border-red-300 bg-red-50',
};

export default function Leads() {
  const { leads, clients, addLead, updateLead, deleteLead } = useCRM();
  const [search, setSearch]       = useState('');
  const [stageFilter, setStage]   = useState('All');
  const [tempFilter, setTemp]     = useState('All');
  const [view, setView]           = useState<'table' | 'kanban'>('kanban');
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<Lead | null>(null);
  const [form, setForm]           = useState<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      l.companyName.toLowerCase().includes(q) ||
      l.title.toLowerCase().includes(q) ||
      (l.contactPerson ?? '').toLowerCase().includes(q) ||
      (l.location ?? '').toLowerCase().includes(q);
    const matchStage = stageFilter === 'All' || l.stage === stageFilter;
    const matchTemp  = tempFilter === 'All'  || l.temperature === tempFilter;
    return matchSearch && matchStage && matchTemp;
  });

  const totalPipeline = leads.filter(l => !['Won', 'Lost'].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const weightedPipeline = leads.filter(l => !['Won', 'Lost'].includes(l.stage)).reduce((s, l) => s + l.value * (l.probability / 100), 0);
  const wonRevenue = leads.filter(l => l.stage === 'Won').reduce((s, l) => s + l.value, 0);
  const hotCount = leads.filter(l => l.temperature === 'Hot' && !['Won','Lost'].includes(l.stage)).length;

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(l: Lead) {
    setEditing(l);
    const { id, createdAt, updatedAt, ...rest } = l;
    setForm(rest);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    if (editing) {
      updateLead({ ...editing, ...form, updatedAt: now });
    } else {
      addLead({ ...form, id: newId(), createdAt: now, updatedAt: now });
    }
    setShowForm(false);
  }

  return (
    <div className="space-y-4">

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-xs text-gray-500">Total Pipeline</p>
          <p className="text-xl font-bold text-gray-900">{fmt(totalPipeline)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Weighted Pipeline</p>
          <p className="text-xl font-bold text-brand-700">{fmt(weightedPipeline)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Won Revenue</p>
          <p className="text-xl font-bold text-green-700">{fmt(wonRevenue)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500">Hot Leads Active</p>
          <p className="text-xl font-bold text-red-600">{hotCount}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search company, contact, location…" className="input pl-9" />
        </div>
        <select value={stageFilter} onChange={e => setStage(e.target.value)} className="input w-44">
          <option value="All">All Stages</option>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={tempFilter} onChange={e => setTemp(e.target.value)} className="input w-32">
          <option value="All">All Temps</option>
          {TEMPS.map(t => <option key={t}>{t}</option>)}
        </select>
        <div className="flex gap-1 ml-auto">
          <button onClick={() => setView('kanban')}
            className={`px-3 py-2 rounded-lg text-sm border ${view === 'kanban' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300'}`}>
            Board
          </button>
          <button onClick={() => setView('table')}
            className={`px-3 py-2 rounded-lg text-sm border ${view === 'table' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300'}`}>
            List
          </button>
          <button onClick={openAdd} className="btn-primary ml-2">
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage &&
              (tempFilter === 'All' || l.temperature === tempFilter) &&
              (!search || l.companyName.toLowerCase().includes(search.toLowerCase()) || l.title.toLowerCase().includes(search.toLowerCase())));
            const stageValue = stageLeads.reduce((s, l) => s + l.value, 0);
            return (
              <div key={stage} className="flex-shrink-0 w-72">
                <div className={`rounded-xl border-2 ${STAGE_COLORS[stage]} p-3 min-h-32`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{stage}</p>
                      <p className="text-xs text-gray-500">{fmt(stageValue)}</p>
                    </div>
                    <span className="w-6 h-6 rounded-full bg-white text-gray-700 text-xs font-bold flex items-center justify-center shadow-sm">
                      {stageLeads.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {stageLeads.map(l => (
                      <div key={l.id} className="bg-white rounded-lg p-3 shadow-sm border border-white hover:border-gray-200">
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <p className="text-sm font-medium text-gray-900 leading-tight">{l.companyName}</p>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-semibold flex-shrink-0 ${TEMP_COLORS[l.temperature]}`}>
                            {l.temperature}
                          </span>
                        </div>
                        {l.contactPerson && (
                          <p className="text-xs text-gray-500 mb-1">{l.contactPerson}</p>
                        )}
                        {l.requirement && (
                          <p className="text-xs text-gray-400 mb-1 italic truncate">{l.requirement}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-semibold text-brand-700">{fmt(l.value)}</span>
                          <span className="text-xs text-gray-400">{l.location}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
                          <div className="bg-brand-500 h-1 rounded-full" style={{ width: `${l.probability}%` }} />
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="text-xs text-gray-400">{l.probability}%</p>
                          <button onClick={() => openEdit(l)} className="text-xs text-gray-400 hover:text-brand-600 flex items-center gap-1">
                            <Pencil size={10} /> Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">Company</th>
                  <th className="th">Contact</th>
                  <th className="th">Requirement</th>
                  <th className="th">Temp</th>
                  <th className="th">Stage</th>
                  <th className="th">Value</th>
                  <th className="th">Location</th>
                  <th className="th">Follow-up</th>
                  <th className="th"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="td text-center text-gray-400 py-10">No leads found.</td></tr>
                ) : filtered.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="td">
                      <p className="font-medium text-gray-900 text-sm">{l.companyName}</p>
                      <p className="text-xs text-gray-400">{l.assignedTo}</p>
                    </td>
                    <td className="td">
                      {l.contactPerson && <p className="text-sm text-gray-700">{l.contactPerson}</p>}
                      {l.contactPhone && (
                        <a href={`tel:${l.contactPhone}`} className="text-xs text-gray-400 flex items-center gap-1 hover:text-brand-600">
                          <Phone size={10} /> {l.contactPhone}
                        </a>
                      )}
                      {l.contactEmail && (
                        <a href={`mailto:${l.contactEmail}`} className="text-xs text-gray-400 flex items-center gap-1 hover:text-brand-600">
                          <Mail size={10} /> {l.contactEmail}
                        </a>
                      )}
                    </td>
                    <td className="td text-xs text-gray-500 max-w-[140px] truncate">{l.requirement ?? '—'}</td>
                    <td className="td">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TEMP_COLORS[l.temperature]}`}>
                        {l.temperature}
                      </span>
                    </td>
                    <td className="td"><StatusBadge value={l.stage} /></td>
                    <td className="td font-semibold text-brand-700 text-sm">{fmt(l.value)}</td>
                    <td className="td text-xs text-gray-500">{l.location}</td>
                    <td className="td text-xs text-gray-500">{l.followUpDate ?? l.expectedCloseDate}</td>
                    <td className="td">
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

      {/* Form Modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Lead' : 'Add Lead'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="label">Company Name *</label>
              <input required className="input" placeholder="e.g. Tech Mahindra Ltd"
                value={form.companyName}
                onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} />
            </div>

            <div>
              <label className="label">Lead Title / Summary *</label>
              <input required className="input" placeholder="e.g. HR Manager hiring"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <label className="label">Contact Person</label>
              <input className="input" placeholder="Full name"
                value={form.contactPerson ?? ''}
                onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))} />
            </div>

            <div>
              <label className="label">Contact Phone</label>
              <input className="input" type="tel" placeholder="98XXXXXXXX"
                value={form.contactPhone ?? ''}
                onChange={e => setForm(p => ({ ...p, contactPhone: e.target.value }))} />
            </div>

            <div>
              <label className="label">Contact Email</label>
              <input className="input" type="email" placeholder="hr@company.com"
                value={form.contactEmail ?? ''}
                onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))} />
            </div>

            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="e.g. Mumbai, Maharashtra"
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Requirement / HR Service Needed</label>
              <input className="input" placeholder="e.g. Permanent staffing – 5 engineers, payroll outsourcing"
                value={form.requirement ?? ''}
                onChange={e => setForm(p => ({ ...p, requirement: e.target.value }))} />
            </div>

            <div>
              <label className="label">Temperature</label>
              <div className="flex gap-2">
                {TEMPS.map(t => (
                  <button key={t} type="button"
                    onClick={() => setForm(p => ({ ...p, temperature: t }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.temperature === t
                        ? t === 'Hot' ? 'bg-red-500 text-white border-red-500'
                          : t === 'Warm' ? 'bg-orange-400 text-white border-orange-400'
                          : 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Stage</label>
              <select className="input" value={form.stage}
                onChange={e => setForm(p => ({ ...p, stage: e.target.value as LeadStage }))}>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Source</label>
              <select className="input" value={form.source}
                onChange={e => setForm(p => ({ ...p, source: e.target.value as LeadSource }))}>
                {SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Linked Client (optional)</label>
              <select className="input" value={form.clientId ?? ''}
                onChange={e => setForm(p => ({ ...p, clientId: e.target.value || undefined }))}>
                <option value="">-- None --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Deal Value (₹)</label>
              <input type="number" className="input" value={form.value}
                onChange={e => setForm(p => ({ ...p, value: +e.target.value }))} />
            </div>

            <div>
              <label className="label">Probability (%)</label>
              <input type="number" min="0" max="100" className="input" value={form.probability}
                onChange={e => setForm(p => ({ ...p, probability: +e.target.value }))} />
            </div>

            <div>
              <label className="label">Assigned To</label>
              <select className="input" value={form.assignedTo}
                onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}>
                {TEAM.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="label">Expected Close Date</label>
              <input type="date" className="input" value={form.expectedCloseDate}
                onChange={e => setForm(p => ({ ...p, expectedCloseDate: e.target.value }))} />
            </div>

            <div>
              <label className="label">Follow-up Date</label>
              <input type="date" className="input" value={form.followUpDate ?? ''}
                onChange={e => setForm(p => ({ ...p, followUpDate: e.target.value }))} />
            </div>

            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea rows={2} className="input resize-none" value={form.notes ?? ''}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Lead'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
