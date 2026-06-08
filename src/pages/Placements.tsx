import { useState } from 'react';
import { Plus, Pencil, CheckCircle2, XCircle } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Placement, PlacementStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const STATUSES: PlacementStatus[] = ['Confirmed', 'Notice Period', 'Joined', 'Dropped'];
const TEAM = ['Annu Chelaramani', 'Priya Mehta', 'Rohit Kapoor', 'Sneha Gupta'];

function newId() { return 'p' + Date.now(); }
const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;

const EMPTY: Omit<Placement, 'id' | 'createdAt'> = {
  candidateId: '', jobOrderId: '', clientId: '',
  status: 'Confirmed', offerDate: new Date().toISOString().slice(0, 10),
  ctcOffered: 0, fee: 0, invoiced: false, recruiter: 'Annu Chelaramani',
};

export default function Placements() {
  const { placements, candidates, jobOrders, clients, addPlacement, updatePlacement } = useCRM();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Placement | null>(null);
  const [form, setForm] = useState<Omit<Placement, 'id' | 'createdAt'>>(EMPTY);

  const totalFees = placements.reduce((s, p) => s + p.fee, 0);
  const invoicedFees = placements.filter(p => p.invoiced).reduce((s, p) => s + p.fee, 0);
  const pendingFees = totalFees - invoicedFees;

  function openAdd() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(p: Placement) {
    setEditing(p);
    const { id, createdAt, ...rest } = p;
    setForm(rest); setShowForm(true);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    if (editing) { updatePlacement({ ...editing, ...form }); }
    else { addPlacement({ ...form, id: newId(), createdAt: now }); }
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{placements.length}</p>
          <p className="text-xs text-gray-500">Total Placements</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{fmt(invoicedFees)}</p>
          <p className="text-xs text-gray-500">Fees Collected</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{fmt(pendingFees)}</p>
          <p className="text-xs text-gray-500">Fees Pending</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Record Placement</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Candidate</th>
                <th className="th">Client</th>
                <th className="th">Job Title</th>
                <th className="th">Status</th>
                <th className="th">Offer Date</th>
                <th className="th">Joining Date</th>
                <th className="th">CTC Offered</th>
                <th className="th">Fee (₹)</th>
                <th className="th">Invoiced</th>
                <th className="th">Recruiter</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {placements.length === 0 ? (
                <tr><td colSpan={11} className="td text-center text-gray-400 py-10">No placements yet.</td></tr>
              ) : placements.map(p => {
                const cand = candidates.find(c => c.id === p.candidateId);
                const client = clients.find(c => c.id === p.clientId);
                const job = jobOrders.find(j => j.id === p.jobOrderId);
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="td font-medium text-gray-900">
                      {cand ? `${cand.firstName} ${cand.lastName}` : '—'}
                    </td>
                    <td className="td text-gray-600">{client?.name ?? '—'}</td>
                    <td className="td text-gray-600">{job?.title ?? '—'}</td>
                    <td className="td"><StatusBadge value={p.status} /></td>
                    <td className="td text-gray-500">{p.offerDate}</td>
                    <td className="td text-gray-500">{p.joiningDate ?? '—'}</td>
                    <td className="td text-gray-700">{fmt(p.ctcOffered)}</td>
                    <td className="td font-semibold text-brand-700">{fmt(p.fee)}</td>
                    <td className="td">
                      {p.invoiced
                        ? <CheckCircle2 size={16} className="text-green-500" />
                        : <XCircle size={16} className="text-red-400" />}
                    </td>
                    <td className="td text-gray-500">{p.recruiter}</td>
                    <td className="td">
                      <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-brand-600"><Pencil size={15} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Placement' : 'Record Placement'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Candidate</label>
              <select className="input" value={form.candidateId}
                onChange={e => setForm(p => ({ ...p, candidateId: e.target.value }))}>
                <option value="">-- Select --</option>
                {candidates.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
              </select>
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
              <label className="label">Job Order</label>
              <select className="input" value={form.jobOrderId}
                onChange={e => setForm(p => ({ ...p, jobOrderId: e.target.value }))}>
                <option value="">-- Select --</option>
                {jobOrders.filter(j => !form.clientId || j.clientId === form.clientId).map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status}
                onChange={e => setForm(p => ({ ...p, status: e.target.value as PlacementStatus }))}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Offer Date</label>
              <input type="date" className="input" value={form.offerDate}
                onChange={e => setForm(p => ({ ...p, offerDate: e.target.value }))} />
            </div>
            <div>
              <label className="label">Joining Date</label>
              <input type="date" className="input" value={form.joiningDate ?? ''}
                onChange={e => setForm(p => ({ ...p, joiningDate: e.target.value }))} />
            </div>
            <div>
              <label className="label">CTC Offered (₹)</label>
              <input type="number" className="input" value={form.ctcOffered}
                onChange={e => setForm(p => ({ ...p, ctcOffered: +e.target.value }))} />
            </div>
            <div>
              <label className="label">Placement Fee (₹)</label>
              <input type="number" className="input" value={form.fee}
                onChange={e => setForm(p => ({ ...p, fee: +e.target.value }))} />
            </div>
            <div>
              <label className="label">Recruiter</label>
              <select className="input" value={form.recruiter}
                onChange={e => setForm(p => ({ ...p, recruiter: e.target.value }))}>
                {TEAM.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col justify-end gap-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="invoiced" checked={form.invoiced}
                  onChange={e => setForm(p => ({ ...p, invoiced: e.target.checked }))}
                  className="w-4 h-4 accent-brand-600" />
                <label htmlFor="invoiced" className="text-sm text-gray-700">Invoice Sent</label>
              </div>
            </div>
            {form.invoiced && (
              <div>
                <label className="label">Payment Date</label>
                <input type="date" className="input" value={form.paidDate ?? ''}
                  onChange={e => setForm(p => ({ ...p, paidDate: e.target.value }))} />
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea rows={2} className="input resize-none" value={form.notes ?? ''}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update' : 'Record Placement'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
