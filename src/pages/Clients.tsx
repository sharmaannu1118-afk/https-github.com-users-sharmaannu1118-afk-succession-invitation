import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, ExternalLink, IndianRupee, Briefcase, Download } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { exportCsv } from '../utils/exportCsv';
import type { Client, ClientStatus, Industry, BillingCycle, WorkMode } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const INDUSTRIES: Industry[] = [
  'Technology','IT Services','E-commerce',
  'Finance','Banking','Insurance',
  'Healthcare','Pharma',
  'Manufacturing','Automotive','Textile & Apparel',
  'Chemicals','Steel & Metals','Plastics & Rubber',
  'Diamond & Gems','Jewellery',
  'Food & Beverages','FMCG','Agriculture',
  'Real Estate','Construction',
  'Retail','Wholesale & Distribution',
  'Transport & Logistics','Exports & Trading',
  'Education','Consulting','Legal & Compliance',
  'Hospitality & Tourism','Media & Entertainment',
  'Telecommunications','Energy & Power',
  'NGO / Non-Profit','Other',
];
const STATUSES: ClientStatus[]    = ['Active', 'Inactive', 'Prospect'];
const BILLING_CYCLES: BillingCycle[] = ['Monthly', 'Quarterly', 'Annual', 'Project-Based', 'Pro Bono'];
const WORK_MODES: WorkMode[]       = ['Onsite', 'Hybrid', 'Weekly Visit', 'Remote'];
const TEAM = ['Annu Sharma'];

function newId() { return 'c' + Date.now(); }

const fmt = (n: number) =>
  n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

// Convert any billing amount to monthly equivalent for summary
function toMonthly(amount: number, cycle: BillingCycle): number {
  if (cycle === 'Monthly')       return amount;
  if (cycle === 'Quarterly')     return amount / 3;
  if (cycle === 'Annual')        return amount / 12;
  return 0; // Project-Based / Pro Bono = not counted in recurring revenue
}

const WORK_MODE_COLORS: Record<WorkMode, string> = {
  'Onsite':       'bg-green-100 text-green-700',
  'Hybrid':       'bg-blue-100 text-blue-700',
  'Weekly Visit': 'bg-purple-100 text-purple-700',
  'Remote':       'bg-gray-100 text-gray-600',
};

const EMPTY: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', industry: 'Technology', status: 'Prospect',
  city: '', country: 'India', accountManager: 'Annu Sharma',
};

export default function Clients() {
  const { clients, contacts, addClient, updateClient, deleteClient } = useCRM();
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState<Client | null>(null);
  const [viewing, setViewing]         = useState<Client | null>(null);
  const [form, setForm]               = useState<Omit<Client, 'id' | 'createdAt' | 'updatedAt'>>(EMPTY);

  const statusOrder: Record<string, number> = { Active: 0, Inactive: 1, Prospect: 2 };
  const filtered = clients
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));

  // ── Earnings summary (active clients only) ──────────────────────────────
  const activeClients = clients.filter(c => c.status === 'Active');
  const monthlyRevenue = activeClients.reduce((sum, c) => {
    if (!c.billingAmount || !c.billingCycle) return sum;
    return sum + toMonthly(c.billingAmount, c.billingCycle);
  }, 0);
  const yearlyRevenue  = monthlyRevenue * 12;
  const recurringCount = activeClients.filter(c => c.billingAmount && c.billingCycle && c.billingCycle !== 'Project-Based').length;

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

      {/* Earnings Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 border-l-4 border-green-400">
          <p className="text-xs text-gray-500">Monthly Earnings</p>
          <p className="text-2xl font-bold text-green-700">{fmt(monthlyRevenue)}</p>
          <p className="text-xs text-gray-400 mt-0.5">from {recurringCount} retainer client{recurringCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="card p-4 border-l-4 border-brand-400">
          <p className="text-xs text-gray-500">Yearly Earnings</p>
          <p className="text-2xl font-bold text-brand-700">{fmt(yearlyRevenue)}</p>
          <p className="text-xs text-gray-400 mt-0.5">projected annual</p>
        </div>
        {STATUSES.map(s => (
          <div key={s} className="card p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{clients.filter(c => c.status === s).length}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s}</p>
          </div>
        ))}
      </div>

      {/* Per-client earning badges for active clients */}
      {activeClients.filter(c => c.billingAmount).length > 0 && (
        <div className="flex flex-wrap gap-3">
          {activeClients.filter(c => c.billingAmount).map(c => (
            <div key={c.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {c.name[0]}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">{c.name}</p>
                <p className="text-xs text-green-700 font-bold">
                  {fmt(c.billingAmount!)}
                  <span className="text-gray-400 font-normal"> / {c.billingCycle}</span>
                </p>
              </div>
              {c.workMode && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${WORK_MODE_COLORS[c.workMode]}`}>
                  {c.workMode}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..." className="input pl-9" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-36">
          <option value="All">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <button
          onClick={() => exportCsv('AnnuHR-Clients.csv', clients.map(c => ({
            'Name':            c.name,
            'Industry':        c.industry,
            'Status':          c.status,
            'City':            c.city ?? '',
            'Country':         c.country ?? '',
            'Phone':           c.phone ?? '',
            'Email':           c.email ?? '',
            'Employees':       c.employees ?? '',
            'Billing Amount':  c.billingAmount ?? '',
            'Billing Cycle':   c.billingCycle ?? '',
            'Work Mode':       c.workMode ?? '',
            'Account Manager': c.accountManager,
            'Notes':           c.notes ?? '',
            'Created':         c.createdAt,
          })))}
          className="btn-secondary flex items-center gap-1.5"
          title="Export Clients to CSV"
        >
          <Download size={14} /> Export CSV
        </button>
        <button onClick={openAdd} className="btn-primary ml-auto">
          <Plus size={16} /> Add Client
        </button>
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
                <th className="th">Work Mode</th>
                <th className="th">Billing</th>
                <th className="th">City</th>
                <th className="th">Contacts</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="td text-center text-gray-400 py-10">No clients found.</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="td">
                    <button onClick={() => setViewing(c)} className="flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {c.name[0]}
                      </div>
                      <span className="font-medium text-gray-900 group-hover:text-brand-600">{c.name}</span>
                    </button>
                  </td>
                  <td className="td text-gray-500 text-sm">{c.industry}</td>
                  <td className="td"><StatusBadge value={c.status} /></td>
                  <td className="td">
                    {c.workMode ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${WORK_MODE_COLORS[c.workMode]}`}>
                        {c.workMode}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="td">
                    {c.billingCycle === 'Pro Bono' ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Pro Bono</span>
                    ) : c.billingAmount && c.billingCycle ? (
                      <div>
                        <p className="text-sm font-semibold text-green-700">{fmt(c.billingAmount)}</p>
                        <p className="text-xs text-gray-400">{c.billingCycle}</p>
                      </div>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="td text-gray-500 text-sm">{c.city}</td>
                  <td className="td text-gray-500 text-sm">{contacts.filter(ct => ct.clientId === c.id).length}</td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-brand-600"><Pencil size={15} /></button>
                      <button onClick={() => deleteClient(c.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={15} /></button>
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

            {/* ── Earnings & Engagement ── */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-3 mt-1">
                <IndianRupee size={14} className="text-brand-600" />
                <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">Earnings & Work Mode</span>
              </div>
            </div>

            <div>
              <label className="label">Billing Cycle</label>
              <select className="input" value={form.billingCycle ?? ''}
                onChange={e => setForm(p => ({ ...p, billingCycle: e.target.value as BillingCycle || undefined, billingAmount: e.target.value === 'Pro Bono' ? undefined : p.billingAmount }))}>
                <option value="">-- Select --</option>
                {BILLING_CYCLES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>

            {form.billingCycle && form.billingCycle !== 'Pro Bono' && (
            <div>
              <label className="label">Billing Amount (₹)</label>
              <input type="number" className="input" placeholder="e.g. 10000"
                value={form.billingAmount ?? ''}
                onChange={e => setForm(p => ({ ...p, billingAmount: +e.target.value || undefined }))} />
            </div>
            )}

            <div className="sm:col-span-2">
              <label className="label">Mode of Working</label>
              <div className="flex gap-2 flex-wrap">
                {WORK_MODES.map(m => (
                  <button key={m} type="button"
                    onClick={() => setForm(p => ({ ...p, workMode: p.workMode === m ? undefined : m }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      form.workMode === m
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Contact Details ── */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-3 mt-1">
                <Briefcase size={14} className="text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact & Location</span>
              </div>
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
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <StatusBadge value={viewing.status} />
                    {viewing.workMode && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${WORK_MODE_COLORS[viewing.workMode]}`}>
                        {viewing.workMode}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing highlight */}
              {viewing.billingAmount && viewing.billingCycle && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs text-green-600 font-semibold mb-1">Billing</p>
                  <p className="text-2xl font-bold text-green-700">
                    {fmt(viewing.billingAmount)}
                    <span className="text-sm font-normal text-green-600 ml-1">/ {viewing.billingCycle}</span>
                  </p>
                  {viewing.billingCycle !== 'Project-Based' && (
                    <p className="text-xs text-green-600 mt-0.5">
                      ≈ {fmt(toMonthly(viewing.billingAmount, viewing.billingCycle))}/month
                      &nbsp;·&nbsp;
                      {fmt(toMonthly(viewing.billingAmount, viewing.billingCycle) * 12)}/year
                    </p>
                  )}
                </div>
              )}

              <dl className="space-y-2 text-sm">
                {[
                  ['Industry',       viewing.industry],
                  ['City / Country', `${viewing.city}, ${viewing.country}`],
                  ['Email',          viewing.email],
                  ['Phone',          viewing.phone],
                  ['Website',        viewing.website],
                  ['Account Manager',viewing.accountManager],
                  ['Employees',      viewing.employees?.toLocaleString('en-IN')],
                  ['Created',        viewing.createdAt],
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
