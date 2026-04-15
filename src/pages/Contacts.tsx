import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Star } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Contact, ContactRole } from '../types';
import Modal from '../components/Modal';

const ROLES: ContactRole[] = [
  'HR Manager','HR Director','CHRO','Talent Acquisition',
  'CEO','CFO','MD','Director','Owner','Business Partner','Hiring Manager','Other'
];

function newId() { return 'ct' + Date.now(); }

const EMPTY: Omit<Contact, 'id' | 'createdAt'> = {
  clientId: '', firstName: '', lastName: '', role: 'HR Manager',
  email: '', isPrimary: false,
};

export default function Contacts() {
  const { contacts, clients, addContact, updateContact, deleteContact } = useCRM();
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<Omit<Contact, 'id' | 'createdAt'>>(EMPTY);

  const filtered = contacts.filter(ct => {
    const name = `${ct.firstName} ${ct.lastName}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || ct.email.toLowerCase().includes(search.toLowerCase());
    const matchClient = clientFilter === 'All' || ct.clientId === clientFilter;
    return matchSearch && matchClient;
  });

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY, clientId: clients[0]?.id ?? '' });
    setShowForm(true);
  }

  function openEdit(c: Contact) {
    setEditing(c);
    const { id, createdAt, ...rest } = c;
    setForm(rest);
    setShowForm(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    if (editing) {
      updateContact({ ...editing, ...form });
    } else {
      addContact({ ...form, id: newId(), createdAt: now });
    }
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..." className="input pl-9" />
        </div>
        <select value={clientFilter} onChange={e => setClientFilter(e.target.value)} className="input w-48">
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={openAdd} className="btn-primary ml-auto">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="th">Name</th>
                <th className="th">Role</th>
                <th className="th">Company</th>
                <th className="th">Email</th>
                <th className="th">Phone</th>
                <th className="th">Primary</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="td text-center text-gray-400 py-10">No contacts found.</td></tr>
              ) : filtered.map(ct => {
                const client = clients.find(c => c.id === ct.clientId);
                return (
                  <tr key={ct.id} className="hover:bg-gray-50">
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {ct.firstName[0]}
                        </div>
                        <span className="font-medium text-gray-900">{ct.firstName} {ct.lastName}</span>
                      </div>
                    </td>
                    <td className="td text-gray-500 text-xs">{ct.role}</td>
                    <td className="td text-gray-700">{client?.name ?? '—'}</td>
                    <td className="td text-gray-500">{ct.email}</td>
                    <td className="td text-gray-500">{ct.phone ?? '—'}</td>
                    <td className="td">
                      {ct.isPrimary && <Star size={14} className="text-yellow-500 fill-yellow-400" />}
                    </td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(ct)} className="text-gray-400 hover:text-brand-600">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => deleteContact(ct.id)} className="text-gray-400 hover:text-red-500">
                          <Trash2 size={15} />
                        </button>
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
        <Modal title={editing ? 'Edit Contact' : 'Add Contact'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input required className="input" value={form.firstName}
                onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input required className="input" value={form.lastName}
                onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value as ContactRole }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Company</label>
              <select className="input" value={form.clientId}
                onChange={e => setForm(p => ({ ...p, clientId: e.target.value }))}>
                <option value="">-- Select --</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Email *</label>
              <input required type="email" className="input" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone ?? ''}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="label">LinkedIn URL</label>
              <input className="input" value={form.linkedin ?? ''}
                onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" id="primary" checked={form.isPrimary}
                onChange={e => setForm(p => ({ ...p, isPrimary: e.target.checked }))}
                className="w-4 h-4 accent-brand-600" />
              <label htmlFor="primary" className="text-sm text-gray-700">Primary Contact</label>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea rows={2} className="input resize-none" value={form.notes ?? ''}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add Contact'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
