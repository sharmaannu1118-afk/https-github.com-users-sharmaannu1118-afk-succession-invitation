import { useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Lead, LeadStage, LeadSource } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const STAGES: LeadStage[] = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
const SOURCES: LeadSource[] = ['Referral', 'LinkedIn', 'Email Campaign', 'Cold Call', 'Website', 'Event', 'Partner'];
const TEAM = ['Annu Sharma', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];

function newId() { return 'l' + Date.now(); }

const fmt = (n: number) =>
  n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(1)}Cr`
  : n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

const EMPTY: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '', stage: 'New', source: 'Referral',
  value: 0, probability: 20, assignedTo: 'Annu Sharma',
  expectedCloseDate: new Date().toISOString().slice(0, 10),
};

const STAGE_COLORS: Record<LeadStage, string> = {
  New: 'border-blue-300 bg-blue-50',
  Qualified: 'border-indigo-300 bg-indigo-50',
  'Proposal Sent': 'border-yellow-300 bg-yellow-50',
  Negotiation: 'border-orange-300 bg-orange-50',
  Won: 'border-green-300 bg-green-50',
  Lost: 'border-red-300 bg-red-50',
};

export default function Leads() {
  const { leads, clients, contacts, addLead, updateLead, deleteLead } = useCRM();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [view, setView] = useState<'table' | 'kanban'>('kanban');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);

  const filtered = leads.filter(l => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === 'All' || l.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const totalPipeline = leads
    .filter(l => !['Won', 'Lost'].includes(l.stage))
    .reduce((s, l) => s + l.value, 0);
  const weightedPipeline = leads
    .filter(l => !['Won', 'Lost'].includes(l.stage))
    .reduce((s, l) => s + l.value * (l.probability / 100), 0);
  const wonRevenue = leads.filter(l => l.stage === 'Won').reduce((s, l) => s + l.value, 0);

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
      <div className="grid grid-cols-3 gap-4">
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
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search leads..." className="input pl-9" />
        </div>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="input w-40">
          <option value="All">All Stages</option>
          {STAGES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="flex gap-1 ml-auto">
          <button
            onClick={() => setView('kanban')}
            className={`px-3 py-2 rounded-lg text-sm border ${view === 'kanban' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300'}`}
          >
            Board
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-3 py-2 rounded-lg text-sm border ${view === 'table' ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-300'}`}
          >
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
            const stageLeads = leads.filter(l => l.stage === stage);
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
                    {stageLeads.map(l => {
                      const client = clients.find(c => c.id === l.clientId);
                      return (
                        <div key={l.id} className="bg-white rounded-lg p-3 shadow-sm border border-white hover:border-gray-200">
                          <p className="text-sm font-medium text-gray-900 mb-1">{l.title}</p>
                          {client && <p className="text-xs text-gray-500 mb-2">{client.name}</p>}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-brand-700">{fmt(l.value)}</span>
                            <span className="text-xs text-gray-500">{l.probability}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1 mt-2">
                            <div className="bg-brand-500 h-1 rounded-full" style={{ width: `${l.probability}%` }} />
                          </div>
                          <p className="text-xs text-gray-400 mt-1.5">{l.assignedTo}</p>
                          <div className="flex gap-1 mt-2">
                            <button onClick={() => openEdit(l)} className="text-xs text-gray-400 hover:text-brand-600 flex items-center gap-1">
                              <Pencil size={11} /> Edit
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
                  <th className="th">Title</th>
                  <th className="th">Client</th>
                  <th className="th">Stage</th>
                  <th className="th">Value</th>
                  <th className="th">Prob</th>
                  <th className="th">Assigned To</th>
                  <th className="th">Close Date</th>
                  <th className="th"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="td text-center text-gray-400 py-10">No leads found.</td></tr>
                ) : filtered.map(l => {
                  const client = clients.find(c => c.id === l.clientId);
                  return (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="td font-medium text-gray-900">{l.title}</td>
                      <td className="td text-gray-500">{client?.name ?? '—'}</td>
                      <td className="td"><StatusBadge value={l.stage} /></td>
                      <td className="td font-semibold text-brand-700">{fmt(l.value)}</td>
                      <td className="td text-gray-500">{l.probability}%</td>
                      <td className="td text-gray-500">{l.assignedTo}</td>
                      <td className="td text-gray-500">{l.expectedCloseDate}</td>
                      <td className="td">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(l)} className="text-gray-400 hover:text-brand-600"><Pencil size={15} /></button>
                          <button onClick={() => deleteLead(l.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Lead' : 'Add Lead'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Lead Title *</label>
              <input required className="input" value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label className="label">Client</label>
              <select className="input" value={form.clientId ?? ''}
                onChange={e => setForm(p => ({ ...p, clientId: e.target.value || undefined }))}>
                <option value="">-- None --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Contact</label>
              <select className="input" value={form.contactId ?? ''}
                onChange={e => setForm(p => ({ ...p, contactId: e.target.value || undefined }))}>
                <option value="">-- None --</option>
                {contacts.filter(ct => !form.clientId || ct.clientId === form.clientId).map(ct => (
                  <option key={ct.id} value={ct.id}>{ct.firstName} {ct.lastName}</option>
                ))}
              </select>
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
