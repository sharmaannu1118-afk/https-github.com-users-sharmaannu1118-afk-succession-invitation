import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Phone, Mail, Link2, X, MapPin, Download } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { exportCsv } from '../utils/exportCsv';
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
  const [search, setSearch]           = useState('');
  const [clientFilter, setClientFilter] = useState('All');
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState<Contact | null>(null);
  const [viewing, setViewing]         = useState<Contact | null>(null);
  const [form, setForm]               = useState<Omit<Contact, 'id' | 'createdAt'>>(EMPTY);

  const statusOrder: Record<string, number> = { Active: 0, Prospect: 1, Inactive: 2 };

  const filtered = contacts
    .filter(ct => {
      const name = `${ct.firstName} ${ct.lastName}`.toLowerCase();
      const matchSearch = name.includes(search.toLowerCase()) ||
        ct.email.toLowerCase().includes(search.toLowerCase()) ||
        (ct.phone ?? '').includes(search);
      const matchClient = clientFilter === 'All' || ct.clientId === clientFilter;
      return matchSearch && matchClient;
    })
    .sort((a, b) => {
      const ca = clients.find(c => c.id === a.clientId);
      const cb = clients.find(c => c.id === b.clientId);
      return (statusOrder[ca?.status ?? 'Inactive'] ?? 2) - (statusOrder[cb?.status ?? 'Inactive'] ?? 2);
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
    setViewing(null);
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

  const ROLE_COLORS: Record<string, string> = {
    'HR Manager': 'bg-blue-100 text-blue-700',
    'HR Director': 'bg-indigo-100 text-indigo-700',
    'CHRO': 'bg-purple-100 text-purple-700',
    'CEO': 'bg-red-100 text-red-700',
    'CFO': 'bg-orange-100 text-orange-700',
    'MD': 'bg-amber-100 text-amber-700',
    'Director': 'bg-rose-100 text-rose-700',
    'Owner': 'bg-green-100 text-green-700',
    'Business Partner': 'bg-teal-100 text-teal-700',
    'Hiring Manager': 'bg-cyan-100 text-cyan-700',
  };

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
        <button
          onClick={() => exportCsv('AnnuHR-Contacts.csv', contacts.map(c => {
            const company = clients.find(cl => cl.id === c.clientId)?.name ?? '';
            return {
              'First Name': c.firstName,
              'Last Name':  c.lastName ?? '',
              'Role':       c.role ?? '',
              'Company':    company,
              'Email':      c.email ?? '',
              'Phone':      c.phone ?? '',
              'LinkedIn':   c.linkedin ?? '',
              'Location':   c.location ?? '',
              'Created':    c.createdAt,
            };
          }))}
          className="btn-secondary flex items-center gap-1.5"
          title="Export Contacts to CSV"
        >
          <Download size={14} /> Export CSV
        </button>
        <button onClick={openAdd} className="btn-primary ml-auto">
          <Plus size={16} /> Add Contact
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr>
                <th className="th w-44">Name</th>
                <th className="th w-32">Role</th>
                <th className="th w-44">Company</th>
                <th className="th w-52">Email</th>
                <th className="th w-40">Phone</th>
                <th className="th w-36">Location</th>
                <th className="th w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="td text-center text-gray-400 py-10">No contacts found.</td></tr>
              ) : filtered.map(ct => {
                const client = clients.find(c => c.id === ct.clientId);
                return (
                  <tr key={ct.id} className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setViewing(ct)}>
                    <td className="td whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {ct.firstName[0]}
                        </div>
                        <span className="font-medium text-gray-900 truncate">{ct.firstName} {ct.lastName}</span>
                      </div>
                    </td>
                    <td className="td whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[ct.role] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ct.role}
                      </span>
                    </td>
                    <td className="td whitespace-nowrap text-gray-700 truncate max-w-[176px]">{client?.name ?? '—'}</td>
                    <td className="td whitespace-nowrap">
                      {ct.email ? (
                        <a href={`mailto:${ct.email}`} onClick={e => e.stopPropagation()}
                          className="text-gray-500 hover:text-brand-600 flex items-center gap-1 text-sm truncate max-w-[200px]">
                          <Mail size={12} className="flex-shrink-0" /> {ct.email}
                        </a>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="td whitespace-nowrap">
                      {ct.phone ? (
                        <a href={`tel:${ct.phone}`} onClick={e => e.stopPropagation()}
                          className="text-gray-500 hover:text-brand-600 flex items-center gap-1 text-sm">
                          <Phone size={12} className="flex-shrink-0" /> {ct.phone}
                        </a>
                      ) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="td whitespace-nowrap text-xs text-gray-500 truncate max-w-[144px]">{ct.location ?? '—'}</td>
                    <td className="td whitespace-nowrap" onClick={e => e.stopPropagation()}>
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

      {/* ── View Contact Modal ─────────────────────────────────────────────── */}
      {viewing && (() => {
        const client = clients.find(c => c.id === viewing.clientId);
        return (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-brand-600 rounded-t-2xl p-6 text-white flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {viewing.firstName[0]}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{viewing.firstName} {viewing.lastName}</h2>
                      <span className="text-sm text-indigo-200">{viewing.role}</span>
                    </div>
                  </div>
                  <button onClick={() => setViewing(null)} className="text-white/70 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body — scrollable */}
              <div className="p-6 space-y-3 overflow-y-auto flex-1">
                {client && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                      {client.name[0]}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Company</p>
                      <p className="text-sm font-semibold text-gray-900">{client.name}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {viewing.email && (
                    <a href={`mailto:${viewing.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                      <Mail size={18} className="text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-800">{viewing.email}</p>
                      </div>
                    </a>
                  )}
                  {viewing.phone && (
                    <a href={`tel:${viewing.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-green-50 hover:border-green-200 transition-colors">
                      <Phone size={18} className="text-green-500" />
                      <div>
                        <p className="text-xs text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-800">{viewing.phone}</p>
                      </div>
                    </a>
                  )}
                  {viewing.linkedin && (
                    <a href={viewing.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                      <Link2 size={18} className="text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-400">LinkedIn</p>
                        <p className="text-sm font-medium text-blue-600 truncate">{viewing.linkedin}</p>
                      </div>
                    </a>
                  )}
                  {viewing.website && (
                    <a href={viewing.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-colors">
                      <Link2 size={18} className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-400">Company Website</p>
                        <p className="text-sm font-medium text-purple-600 truncate">{viewing.website}</p>
                      </div>
                    </a>
                  )}
                  {viewing.location && (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                      <MapPin size={18} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm font-medium text-gray-800">{viewing.location}</p>
                      </div>
                    </div>
                  )}
                  {viewing.notes && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-600 font-medium mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{viewing.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer — always visible */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex gap-3 flex-shrink-0">
                <button onClick={() => openEdit(viewing)}
                  className="flex-1 btn-primary justify-center flex items-center gap-2">
                  <Pencil size={14} /> Edit Contact
                </button>
                <button onClick={() => setViewing(null)} className="btn-secondary">Close</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Add / Edit Form ────────────────────────────────────────────────── */}
      {showForm && (
        <Modal title={editing ? 'Edit Contact' : 'Add Contact'} onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Contact Person Name *</label>
              <input required className="input" placeholder="e.g. Rahul Mehta"
                value={form.firstName}
                onChange={e => setForm(p => ({ ...p, firstName: e.target.value, lastName: '' }))} />
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
              <label className="label">Email</label>
              <input type="email" className="input" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone ?? ''}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="label">LinkedIn URL</label>
              <input className="input" placeholder="https://linkedin.com/in/..."
                value={form.linkedin ?? ''}
                onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} />
            </div>
            <div>
              <label className="label">Company Website</label>
              <input className="input" placeholder="https://www.company.com"
                value={form.website ?? ''}
                onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
            </div>
            <div>
              <label className="label">Location</label>
              <select className="input" value={form.location ?? ''}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}>
                <option value="">-- Select Location --</option>

                <optgroup label="── Gujarat ──">
                  <option>Ahmedabad, Gujarat</option>
                  <option>Surat, Gujarat</option>
                  <option>Vadodara, Gujarat</option>
                  <option>Rajkot, Gujarat</option>
                  <option>Gandhinagar, Gujarat</option>
                  <option>Bhavnagar, Gujarat</option>
                  <option>Jamnagar, Gujarat</option>
                  <option>Junagadh, Gujarat</option>
                  <option>Anand, Gujarat</option>
                  <option>Navsari, Gujarat</option>
                  <option>Valsad, Gujarat</option>
                  <option>Vapi, Gujarat</option>
                  <option>Bharuch, Gujarat</option>
                  <option>Ankleshwar, Gujarat</option>
                  <option>Morbi, Gujarat</option>
                  <option>Mehsana, Gujarat</option>
                  <option>Surendranagar, Gujarat</option>
                  <option>Patan, Gujarat</option>
                  <option>Dahod, Gujarat</option>
                  <option>Godhra, Gujarat</option>
                  <option>Amreli, Gujarat</option>
                  <option>Porbandar, Gujarat</option>
                  <option>Veraval, Gujarat</option>
                  <option>Hazira, Surat</option>
                  <option>Sachin, Surat</option>
                  <option>Katargam, Surat</option>
                  <option>Varachha, Surat</option>
                  <option>Olpad, Surat</option>
                  <option>Vyara, Gujarat</option>
                  <option>Bardoli, Gujarat</option>
                </optgroup>

                <optgroup label="── Union Territories ──">
                  <option>Daman, Daman &amp; Diu</option>
                  <option>Diu, Daman &amp; Diu</option>
                  <option>Silvassa, Dadra &amp; Nagar Haveli</option>
                  <option>New Delhi, Delhi</option>
                  <option>Noida, Delhi NCR</option>
                  <option>Gurgaon, Delhi NCR</option>
                  <option>Faridabad, Delhi NCR</option>
                  <option>Ghaziabad, Delhi NCR</option>
                  <option>Chandigarh</option>
                  <option>Puducherry</option>
                  <option>Port Blair, Andaman &amp; Nicobar</option>
                  <option>Leh, Ladakh</option>
                  <option>Jammu, J&amp;K</option>
                  <option>Srinagar, J&amp;K</option>
                </optgroup>

                <optgroup label="── Maharashtra ──">
                  <option>Mumbai, Maharashtra</option>
                  <option>Pune, Maharashtra</option>
                  <option>Nagpur, Maharashtra</option>
                  <option>Thane, Maharashtra</option>
                  <option>Navi Mumbai, Maharashtra</option>
                  <option>Nashik, Maharashtra</option>
                  <option>Aurangabad, Maharashtra</option>
                  <option>Solapur, Maharashtra</option>
                  <option>Kolhapur, Maharashtra</option>
                  <option>Amravati, Maharashtra</option>
                  <option>Nanded, Maharashtra</option>
                  <option>Sangli, Maharashtra</option>
                  <option>Malegaon, Maharashtra</option>
                  <option>Jalgaon, Maharashtra</option>
                  <option>Akola, Maharashtra</option>
                  <option>Latur, Maharashtra</option>
                  <option>Dhule, Maharashtra</option>
                </optgroup>

                <optgroup label="── Rajasthan ──">
                  <option>Jaipur, Rajasthan</option>
                  <option>Jodhpur, Rajasthan</option>
                  <option>Udaipur, Rajasthan</option>
                  <option>Kota, Rajasthan</option>
                  <option>Ajmer, Rajasthan</option>
                  <option>Bikaner, Rajasthan</option>
                  <option>Alwar, Rajasthan</option>
                  <option>Bhilwara, Rajasthan</option>
                  <option>Sikar, Rajasthan</option>
                </optgroup>

                <optgroup label="── Madhya Pradesh ──">
                  <option>Bhopal, Madhya Pradesh</option>
                  <option>Indore, Madhya Pradesh</option>
                  <option>Gwalior, Madhya Pradesh</option>
                  <option>Jabalpur, Madhya Pradesh</option>
                  <option>Ujjain, Madhya Pradesh</option>
                  <option>Sagar, Madhya Pradesh</option>
                  <option>Dewas, Madhya Pradesh</option>
                  <option>Ratlam, Madhya Pradesh</option>
                </optgroup>

                <optgroup label="── Karnataka ──">
                  <option>Bengaluru, Karnataka</option>
                  <option>Mysuru, Karnataka</option>
                  <option>Hubli, Karnataka</option>
                  <option>Mangaluru, Karnataka</option>
                  <option>Belagavi, Karnataka</option>
                  <option>Davangere, Karnataka</option>
                  <option>Ballari, Karnataka</option>
                  <option>Tumakuru, Karnataka</option>
                </optgroup>

                <optgroup label="── Tamil Nadu ──">
                  <option>Chennai, Tamil Nadu</option>
                  <option>Coimbatore, Tamil Nadu</option>
                  <option>Madurai, Tamil Nadu</option>
                  <option>Tiruchirappalli, Tamil Nadu</option>
                  <option>Salem, Tamil Nadu</option>
                  <option>Tirunelveli, Tamil Nadu</option>
                  <option>Erode, Tamil Nadu</option>
                  <option>Vellore, Tamil Nadu</option>
                </optgroup>

                <optgroup label="── Telangana ──">
                  <option>Hyderabad, Telangana</option>
                  <option>Warangal, Telangana</option>
                  <option>Nizamabad, Telangana</option>
                  <option>Karimnagar, Telangana</option>
                  <option>Khammam, Telangana</option>
                </optgroup>

                <optgroup label="── Andhra Pradesh ──">
                  <option>Visakhapatnam, Andhra Pradesh</option>
                  <option>Vijayawada, Andhra Pradesh</option>
                  <option>Guntur, Andhra Pradesh</option>
                  <option>Nellore, Andhra Pradesh</option>
                  <option>Kurnool, Andhra Pradesh</option>
                  <option>Tirupati, Andhra Pradesh</option>
                </optgroup>

                <optgroup label="── Kerala ──">
                  <option>Thiruvananthapuram, Kerala</option>
                  <option>Kochi, Kerala</option>
                  <option>Kozhikode, Kerala</option>
                  <option>Thrissur, Kerala</option>
                  <option>Kollam, Kerala</option>
                  <option>Kannur, Kerala</option>
                </optgroup>

                <optgroup label="── Uttar Pradesh ──">
                  <option>Lucknow, Uttar Pradesh</option>
                  <option>Kanpur, Uttar Pradesh</option>
                  <option>Agra, Uttar Pradesh</option>
                  <option>Varanasi, Uttar Pradesh</option>
                  <option>Meerut, Uttar Pradesh</option>
                  <option>Allahabad, Uttar Pradesh</option>
                  <option>Bareilly, Uttar Pradesh</option>
                  <option>Moradabad, Uttar Pradesh</option>
                  <option>Ghaziabad, Uttar Pradesh</option>
                  <option>Aligarh, Uttar Pradesh</option>
                </optgroup>

                <optgroup label="── Bihar ──">
                  <option>Patna, Bihar</option>
                  <option>Gaya, Bihar</option>
                  <option>Bhagalpur, Bihar</option>
                  <option>Muzaffarpur, Bihar</option>
                </optgroup>

                <optgroup label="── West Bengal ──">
                  <option>Kolkata, West Bengal</option>
                  <option>Howrah, West Bengal</option>
                  <option>Durgapur, West Bengal</option>
                  <option>Asansol, West Bengal</option>
                  <option>Siliguri, West Bengal</option>
                </optgroup>

                <optgroup label="── Punjab ──">
                  <option>Ludhiana, Punjab</option>
                  <option>Amritsar, Punjab</option>
                  <option>Jalandhar, Punjab</option>
                  <option>Patiala, Punjab</option>
                  <option>Bathinda, Punjab</option>
                </optgroup>

                <optgroup label="── Haryana ──">
                  <option>Gurugram, Haryana</option>
                  <option>Faridabad, Haryana</option>
                  <option>Panipat, Haryana</option>
                  <option>Ambala, Haryana</option>
                  <option>Hisar, Haryana</option>
                  <option>Rohtak, Haryana</option>
                </optgroup>

                <optgroup label="── Odisha ──">
                  <option>Bhubaneswar, Odisha</option>
                  <option>Cuttack, Odisha</option>
                  <option>Rourkela, Odisha</option>
                  <option>Berhampur, Odisha</option>
                </optgroup>

                <optgroup label="── Jharkhand ──">
                  <option>Ranchi, Jharkhand</option>
                  <option>Jamshedpur, Jharkhand</option>
                  <option>Dhanbad, Jharkhand</option>
                </optgroup>

                <optgroup label="── Chhattisgarh ──">
                  <option>Raipur, Chhattisgarh</option>
                  <option>Bhilai, Chhattisgarh</option>
                  <option>Bilaspur, Chhattisgarh</option>
                </optgroup>

                <optgroup label="── Uttarakhand ──">
                  <option>Dehradun, Uttarakhand</option>
                  <option>Haridwar, Uttarakhand</option>
                  <option>Roorkee, Uttarakhand</option>
                </optgroup>

                <optgroup label="── Himachal Pradesh ──">
                  <option>Shimla, Himachal Pradesh</option>
                  <option>Manali, Himachal Pradesh</option>
                  <option>Dharamshala, Himachal Pradesh</option>
                </optgroup>

                <optgroup label="── Assam &amp; North East ──">
                  <option>Guwahati, Assam</option>
                  <option>Dibrugarh, Assam</option>
                  <option>Silchar, Assam</option>
                  <option>Imphal, Manipur</option>
                  <option>Shillong, Meghalaya</option>
                  <option>Agartala, Tripura</option>
                  <option>Aizawl, Mizoram</option>
                  <option>Kohima, Nagaland</option>
                  <option>Itanagar, Arunachal Pradesh</option>
                  <option>Gangtok, Sikkim</option>
                </optgroup>

                <optgroup label="── Goa ──">
                  <option>Panaji, Goa</option>
                  <option>Margao, Goa</option>
                  <option>Vasco da Gama, Goa</option>
                </optgroup>

                <optgroup label="── Other ──">
                  <option>Remote / Work From Home</option>
                  <option>Other</option>
                </optgroup>
              </select>
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
