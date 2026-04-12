import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Client, ClientStatus, Industry } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const INDUSTRIES: Industry[] = [
  'Technology','Finance','Healthcare','Manufacturing','Retail','Education','Consulting','FMCG','Real Estate','Other'
];
const STATUSES: ClientStatus[] = ['Active', 'Inactive', 'Prospect'];
const TEAM = ['Annu Sharma', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];

function newId() { return 'c' + Date.now(); }

const EMPTY: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', industry: 'Technology', status: 'Prospect',
  city: '', country: 'India', accountManager: 'Annu Sharma',
};

export default function Clients() {
  const { clients, contacts, addClient, updateClient, deleteClient } = useCRM();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [viewing, setViewing] = useState<Client | null>(null);
  const [form, setForm] = useState<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    const { id, createdAt, updatedAt, ...rest } = c;
    setForm(rest);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    if (editing) {
      updateClient({ ...editing, ...form, updatedAt: now });
    } else {
      addClient({ ...form, id: newId(), createdAt: now, updatedAt: now });
    }
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="input pl-9"
          />
        </div>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="input w-36"
        >
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={openAdd} className="btn-primary ml-auto">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {STATUSES.map(s => (
          <div key={s} className="card p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === s).length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Company</th>
                <th className="th">Industry</th>
                <th className="th">Status</th>
                <th className="th">City</th>
                <th className="th">Account Manager</th>
                <th className="th">Contacts</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="td text-center text-gray-400 py-10">No clients found.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="td">
                    <button
                      onClick={() => setViewing(c)}
                      className="flex items-center gap-2 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {c.name[0]}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-brand-600">{c.name}</span>
                    </button>
                  </td>
                  <td className="td text-gray-500">{c.industry}</td>
                  <td className="td"><StatusBadge value={c.status} /></td>
                  <td className="td text-gray-500">{c.city}</td>
                  <td className="td text-gray-500">{c.accountManager}</td>
                  <td className="td text-gray-500">{contacts.filter(ct => ct.clientId === c.id).length}</td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-brand-600">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => deleteClient(c.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Client' : 'Add New Client'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Company Name *</label>
              <input required className="input" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">Industry</label>
              <select className="input" value={form.industry}
                onChange={e => setForm(p => ({ ...p, industry: e.target.value as Industry }))}>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as ClientStatus }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">City *</label>
              <input required className="input" value={form.city}
                onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input" value={form.country}
                onChange={e => setForm(p => ({ ...p, country: e.target.value }))} />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email ?? ''}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone ?? ''}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="label">Website</label>
              <input className="input" value={form.website ?? ''}
                onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
            </div>
            <div>
              <label className="label">Account Manager</label>
              <select className="input" value={form.accountManager}
                onChange={e => setForm(p => ({ ...p, accountManager: e.target.value }))}>
                {TEAM.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Employees</label>
              <input type="number" className="input" value={form.employees ?? ''}
                onChange={e => setForm(p => ({ ...p, employees: +e.target.value || undefined }))} />
            </div>
            <div>
              <label className="label">Annual Revenue (₹ Cr)</label>
              <input type="number" className="input" value={form.revenue ?? ''}
                onChange={e => setForm(p => ({ ...p, revenue: +e.target.value || undefined }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea rows={2} className="input resize-none" value={form.notes ?? ''}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Client'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {viewing && (
        <Modal title={viewing.name} onClose={() => setViewing(null)} size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-bold">
                  {viewing.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{viewing.name}</h3>
                  <StatusBadge value={viewing.status} />
                </div>
              </div>
              <dl className="space-y-2 text-sm">
                {[
                  ['Industry', viewing.industry],
                  ['City / Country', `${viewing.city}, ${viewing.country}`],
                  ['Email', viewing.email],
                  ['Phone', viewing.phone],
                  ['Website', viewing.website],
                  ['Account Manager', viewing.accountManager],
                  ['Employees', viewing.employees?.toLocaleString('en-IN')],
                  ['Revenue', viewing.revenue ? `₹${viewing.revenue}Cr` : '—'],
                  ['Created', viewing.createdAt],
                ].map(([k, v]) => v ? (
                  <div key={k as string} className="flex gap-2">
                    <dt className="text-gray-500 w-36 flex-shrink-0">{k}</dt>
                    <dd className="text-gray-900 font-medium break-all">{v}</dd>
                  </div>
                ) : null)}
              </dl>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Contacts</h4>
              {contacts.filter(ct => ct.clientId === viewing.id).map(ct => (
                <div key={ct.id} className="flex items-center gap-3 py-2 border-b border-gray-100">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                    {ct.firstName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ct.firstName} {ct.lastName}</p>
                    <p className="text-xs text-gray-500">{ct.role} · {ct.email}</p>
                  </div>
                </div>
              ))}
              {viewing.notes && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-gray-700">
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
            {viewing.website && (
              <a href={viewing.website} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink size={15} /> Visit Website
              </a>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
