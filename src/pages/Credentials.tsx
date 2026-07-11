import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Copy, X, KeyRound, ExternalLink, ClipboardCheck } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Credential } from '../types';

function newId() { return 'cred' + Date.now(); }

interface CredForm {
  name: string;
  url: string;
  username: string;
  password: string;
  notes: string;
}

const BLANK: CredForm = { name: '', url: '', username: '', password: '', notes: '' };

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button onClick={handleCopy} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-brand-600 flex-shrink-0" title="Copy">
      {copied ? <ClipboardCheck size={13} className="text-green-500" /> : <Copy size={13} />}
    </button>
  );
}

export default function Credentials() {
  const { credentials, addCredential, updateCredential, deleteCredential } = useCRM();

  const [search, setSearch]       = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<Credential | null>(null);
  const [form, setForm]           = useState<CredForm>(BLANK);
  const [showPwd, setShowPwd]     = useState(false);
  const [revealedIds, setReveal]  = useState<Set<string>>(new Set());

  function toggleReveal(id: string) {
    setReveal(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function openCreate() {
    setEditing(null);
    setForm(BLANK);
    setShowPwd(false);
    setShowForm(true);
  }

  function openEdit(c: Credential) {
    setEditing(c);
    setForm({ name: c.name, url: c.url ?? '', username: c.username, password: c.password, notes: c.notes ?? '' });
    setShowPwd(false);
    setShowForm(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.username.trim()) return;
    const now = new Date().toISOString();
    const cred: Credential = {
      id:        editing?.id ?? newId(),
      name:      form.name.trim(),
      url:       form.url.trim() || undefined,
      username:  form.username.trim(),
      password:  form.password,
      notes:     form.notes.trim() || undefined,
      createdAt: editing?.createdAt ?? now,
      updatedAt: now,
    };
    editing ? updateCredential(cred) : addCredential(cred);
    setShowForm(false);
  }

  const filtered = useMemo(() => credentials.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q) || (c.url ?? '').toLowerCase().includes(q);
  }), [credentials, search]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Login Credentials</h1>
          <p className="text-sm text-gray-500 mt-0.5">{credentials.length} saved credential{credentials.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add Credential
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-9"
          placeholder="Search portals, usernames…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <KeyRound size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">No credentials saved yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => {
            const revealed = revealedIds.has(c.id);
            return (
              <div key={c.id} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <KeyRound size={18} className="text-brand-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-base">{c.name}</h3>
                      {c.url && (
                        <a href={c.url.startsWith('http') ? c.url : `https://${c.url}`} target="_blank" rel="noreferrer"
                          className="text-brand-500 hover:text-brand-700 flex items-center gap-0.5 text-xs"
                          onClick={e => e.stopPropagation()}
                        >
                          <ExternalLink size={12} /> Open
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Username */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Username / Email</p>
                          <p className="text-sm font-medium text-gray-800 truncate">{c.username}</p>
                        </div>
                        <CopyBtn text={c.username} />
                      </div>

                      {/* Password */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Password</p>
                          <p className="text-sm font-medium text-gray-800 font-mono tracking-widest truncate">
                            {revealed ? c.password : '••••••••'}
                          </p>
                        </div>
                        <button onClick={() => toggleReveal(c.id)} className="p-1 rounded hover:bg-gray-200 text-gray-400 flex-shrink-0" title={revealed ? 'Hide' : 'Show'}>
                          {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <CopyBtn text={c.password} />
                      </div>
                    </div>

                    {c.notes && <p className="text-xs text-gray-500 mt-2">{c.notes}</p>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-brand-600" title="Edit">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => { if (confirm(`Delete "${c.name}"?`)) deleteCredential(c.id); }}
                      className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Credential' : 'Add Credential'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="label">Portal / App Name *</label>
                <input className="input" placeholder="e.g. Naukri, LinkedIn, IndiaMART" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="label">Website / App Link</label>
                <input className="input" placeholder="e.g. https://www.naukri.com" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
              </div>
              <div>
                <label className="label">Username / Email *</label>
                <input className="input" placeholder="Login username or email" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} autoComplete="off" />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="input pr-10"
                    placeholder="Password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <input className="input" placeholder="Optional notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || !form.username.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editing ? 'Save Changes' : 'Save Credential'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
