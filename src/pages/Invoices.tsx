import { useState, useMemo } from 'react';
import {
  Plus, Search, Pencil, Trash2, Printer,
  IndianRupee, CheckCircle2, Clock, FileText, X,
} from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import type { Invoice, InvoiceItem, InvoiceStatus } from '../types';

const STATUSES: InvoiceStatus[] = ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i); // 2 past + current + 3 future

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  Draft:     'bg-gray-100 text-gray-600',
  Sent:      'bg-blue-100 text-blue-700',
  Paid:      'bg-green-100 text-green-700',
  Overdue:   'bg-red-100 text-red-700',
  Cancelled: 'bg-orange-100 text-orange-700',
};

function newId()     { return 'inv'  + Date.now(); }
function newItemId() { return 'item' + Date.now() + Math.random().toString(36).slice(2, 5); }
function todayStr()  { return new Date().toISOString().slice(0, 10); }
function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtMonth(m?: string) {
  if (!m) return '';
  const [y, mo] = m.split('-');
  return new Date(+y, +mo - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}
function nextInvoiceNo(invoices: Invoice[]) {
  const year = new Date().getFullYear();
  const nums = invoices.map(inv => {
    const m = inv.invoiceNumber.match(/INV-\d{4}-(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  });
  return `INV-${year}-${String((nums.length ? Math.max(...nums) : 0) + 1).padStart(3, '0')}`;
}

type FormItem = { id: string; description: string; qty: string; rate: string };
const emptyItem = (): FormItem => ({ id: newItemId(), description: '', qty: '1', rate: '' });

interface InvoiceForm {
  invoiceNumber: string;
  clientId: string;
  month: string;
  description: string;
  status: InvoiceStatus;
  issueDate: string;
  notes: string;
  items: FormItem[];
}

function calcTotal(items: FormItem[]) {
  return items.reduce((s, it) => s + (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0), 0);
}

function printInvoice(invoice: Invoice, clientName: string, clientPhone: string, clientEmail: string) {
  const itemRows = invoice.items.map((it, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${it.description}</td>
      <td style="text-align:center">${it.qty}</td>
      <td style="text-align:right">${fmt(it.rate)}</td>
      <td style="text-align:right">${fmt(it.amount)}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>${invoice.invoiceNumber}</title>
<style>
  body { font-family: Arial, sans-serif; color: #111; margin: 0; padding: 40px; }
  h1 { margin: 0; font-size: 26px; color: #1a2f5e; font-weight: 900; }
  .subtitle { color: #c9a84c; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 3px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; border-bottom: 3px solid #1a2f5e; padding-bottom: 20px; }
  .inv-label { font-size: 28px; font-weight: 800; color: #1a2f5e; text-transform: uppercase; letter-spacing: 2px; }
  .inv-meta { margin-top: 6px; font-size: 13px; color: #444; line-height: 1.7; }
  .inv-meta strong { color: #111; }
  .bill-to { margin-bottom: 24px; }
  .bill-to h4 { color: #888; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; margin: 0 0 5px; }
  .bill-to p { margin: 2px 0; font-size: 13px; }
  .inv-desc { background: #f8f9fb; border-left: 3px solid #1a2f5e; padding: 10px 14px; margin-bottom: 20px; font-size: 13px; color: #333; border-radius: 0 4px 4px 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #1a2f5e; color: white; padding: 10px 12px; font-size: 12px; text-align: left; }
  th:last-child, th:nth-child(4) { text-align: right; }
  th:nth-child(3) { text-align: center; }
  td { padding: 9px 12px; font-size: 13px; border-bottom: 1px solid #eee; }
  .totals { float: right; width: 220px; }
  .totals table { width: 100%; }
  .totals td { border: none; padding: 5px 8px; font-size: 13px; }
  .totals .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #1a2f5e; color: #1a2f5e; padding-top: 8px; }
  .notes { clear: both; margin-top: 28px; padding-top: 14px; border-top: 1px solid #ddd; font-size: 12px; color: #555; }
  .notes strong { color: #222; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
    background: ${invoice.status === 'Paid' ? '#d1fae5' : invoice.status === 'Overdue' ? '#fee2e2' : '#e0e7ff'};
    color: ${invoice.status === 'Paid' ? '#065f46' : invoice.status === 'Overdue' ? '#991b1b' : '#3730a3'}; }
  .footer { margin-top: 44px; text-align: center; font-size: 11px; color: #bbb; border-top: 1px solid #eee; padding-top: 16px; }
  @media print { body { padding: 24px; } }
</style></head><body>
<div class="header">
  <div>
    <h1>Annu Sharma</h1>
    <div class="subtitle">HR Business Partner</div>
    <div style="font-size:11px;color:#666;margin-top:8px;line-height:1.6">
      sharmaannu1118@gmail.com
    </div>
  </div>
  <div style="text-align:right">
    <div class="inv-label">Invoice</div>
    <div class="inv-meta">
      <div><strong>No:</strong> ${invoice.invoiceNumber}</div>
      <div><strong>Date:</strong> ${invoice.issueDate}</div>
      ${invoice.month ? `<div><strong>Month:</strong> ${fmtMonth(invoice.month)}</div>` : ''}
      <div style="margin-top:6px"><span class="status-badge">${invoice.status}</span></div>
    </div>
  </div>
</div>

<div class="bill-to">
  <h4>Bill To</h4>
  <p><strong>${clientName}</strong></p>
  ${clientPhone ? `<p>${clientPhone}</p>` : ''}
  ${clientEmail ? `<p>${clientEmail}</p>` : ''}
</div>

${invoice.description ? `<div class="inv-desc"><strong>Re:</strong> ${invoice.description}</div>` : ''}

<table>
  <thead>
    <tr>
      <th style="width:36px">#</th>
      <th>Service / Description</th>
      <th style="width:60px;text-align:center">Qty</th>
      <th style="width:110px;text-align:right">Rate (₹)</th>
      <th style="width:120px;text-align:right">Amount (₹)</th>
    </tr>
  </thead>
  <tbody>${itemRows}</tbody>
</table>

<div class="totals">
  <table>
    <tr class="total-row">
      <td>Total</td>
      <td style="text-align:right">${fmt(invoice.total)}</td>
    </tr>
  </table>
</div>

${invoice.notes ? `<div class="notes"><strong>Notes / Terms:</strong><br>${invoice.notes}</div>` : ''}

<div class="footer">Thank you for your business!</div>
<script>window.onload = function(){ window.print(); }<\/script>
</body></html>`;

  const win = window.open('', '_blank', 'width=860,height=700');
  if (!win) return;
  win.document.write(html);
  win.document.close();
}

export default function Invoices() {
  const { clients, invoices, addInvoice, updateInvoice, deleteInvoice } = useCRM();

  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('All');
  const [clientFilter, setClient] = useState('All');
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<Invoice | null>(null);
  const [viewing, setViewing]     = useState<Invoice | null>(null);

  const blankForm = (): InvoiceForm => ({
    invoiceNumber: nextInvoiceNo(invoices),
    clientId:    '',
    month:       new Date().toISOString().slice(0, 7),
    description: '',
    status:      'Draft',
    issueDate:   todayStr(),
    notes:       '',
    items:       [emptyItem()],
  });

  const [form, setForm] = useState<InvoiceForm>(blankForm);
  const total = calcTotal(form.items);

  function openCreate() {
    setEditing(null);
    setForm(blankForm());
    setShowForm(true);
  }

  function openEdit(inv: Invoice) {
    setEditing(inv);
    setForm({
      invoiceNumber: inv.invoiceNumber,
      clientId:      inv.clientId,
      month:         inv.month ?? '',
      description:   inv.description ?? '',
      status:        inv.status,
      issueDate:     inv.issueDate,
      notes:         inv.notes ?? '',
      items: inv.items.map(it => ({
        id:          it.id,
        description: it.description,
        qty:         String(it.qty),
        rate:        String(it.rate),
      })),
    });
    setShowForm(true);
  }

  function handleSave() {
    if (!form.clientId || form.items.every(it => !it.description.trim())) return;
    const now = new Date().toISOString();
    const items: InvoiceItem[] = form.items
      .filter(it => it.description.trim())
      .map(it => {
        const qty  = parseFloat(it.qty)  || 0;
        const rate = parseFloat(it.rate) || 0;
        return { id: it.id, description: it.description, qty, rate, amount: qty * rate };
      });
    const tot = items.reduce((s, it) => s + it.amount, 0);

    const inv: Invoice = {
      id:            editing?.id ?? newId(),
      invoiceNumber: form.invoiceNumber,
      clientId:      form.clientId,
      month:         form.month || undefined,
      description:   form.description || undefined,
      items,
      subtotal:      tot,
      taxRate:       0,
      taxAmount:     0,
      total:         tot,
      status:        form.status,
      issueDate:     form.issueDate,
      dueDate:       '',
      paidDate:      editing?.paidDate,
      notes:         form.notes || undefined,
      createdAt:     editing?.createdAt ?? now,
      updatedAt:     now,
    };

    editing ? updateInvoice(inv) : addInvoice(inv);
    setShowForm(false);
  }

  function setItem(idx: number, field: keyof FormItem, val: string) {
    setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [field]: val } : it) }));
  }

  const filtered = useMemo(() => invoices.filter(inv => {
    const client = clients.find(c => c.id === inv.clientId);
    const q = search.toLowerCase();
    const matchQ = !q
      || inv.invoiceNumber.toLowerCase().includes(q)
      || (client?.name ?? '').toLowerCase().includes(q)
      || (inv.description ?? '').toLowerCase().includes(q);
    const matchS = statusFilter === 'All' || inv.status === statusFilter;
    const matchC = clientFilter === 'All' || inv.clientId === clientFilter;
    return matchQ && matchS && matchC;
  }), [invoices, clients, search, statusFilter, clientFilter]);

  const totalInvoiced = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid     = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const totalPending  = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((s, i) => s + i.total, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-0.5">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <IndianRupee size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Invoiced</p>
            <p className="text-xl font-bold text-gray-900">{fmt(totalInvoiced)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Collected</p>
            <p className="text-xl font-bold text-green-700">{fmt(totalPaid)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Pending / Overdue</p>
            <p className="text-xl font-bold text-orange-600">{fmt(totalPending)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search invoice # or client…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input w-auto" value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="input w-auto" value={clientFilter} onChange={e => setClient(e.target.value)}>
          <option value="All">All Clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <FileText size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">No invoices found. Create your first one!</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Invoice #</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Client</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Month</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Amount</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(inv => {
                  const client = clients.find(c => c.id === inv.clientId);
                  return (
                    <tr key={inv.id} onClick={() => setViewing(inv)} className="hover:bg-blue-50 cursor-pointer transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-brand-700">{inv.invoiceNumber}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{client?.name ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{fmtMonth(inv.month) || '—'}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{inv.description || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{inv.issueDate}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{fmt(inv.total)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`badge ${STATUS_COLORS[inv.status]}`}>{inv.status}</span>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(inv)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-brand-600" title="Edit">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => { if (confirm(`Delete ${inv.invoiceNumber}?`)) deleteInvoice(inv.id); }} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600" title="Delete">
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
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Invoice' : 'New Invoice'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Invoice No + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Invoice Number</label>
                  <input className="input bg-gray-50" value={form.invoiceNumber} onChange={e => setForm(f => ({ ...f, invoiceNumber: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as InvoiceStatus }))}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Client + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Client *</label>
                  <select className="input" value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}>
                    <option value="">— Select Client —</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Invoice Date</label>
                  <input type="date" className="input" value={form.issueDate} onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))} />
                </div>
              </div>

              {/* Month + Year */}
              <div>
                <label className="label">Billing Month</label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="input"
                    value={form.month ? form.month.split('-')[1] : ''}
                    onChange={e => {
                      const [y] = form.month ? form.month.split('-') : [String(currentYear)];
                      setForm(f => ({ ...f, month: e.target.value ? `${y}-${e.target.value}` : '' }));
                    }}
                  >
                    <option value="">— Month —</option>
                    {MONTH_NAMES.map((name, i) => (
                      <option key={name} value={String(i + 1).padStart(2, '0')}>{name}</option>
                    ))}
                  </select>
                  <select
                    className="input"
                    value={form.month ? form.month.split('-')[0] : ''}
                    onChange={e => {
                      const [, m] = form.month ? form.month.split('-') : ['', ''];
                      setForm(f => ({ ...f, month: e.target.value && m ? `${e.target.value}-${m}` : '' }));
                    }}
                  >
                    <option value="">— Year —</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="label">Invoice Description</label>
                <input
                  className="input"
                  placeholder="e.g. HR Consulting Services – June 2026"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Services / Line Items *</label>
                  <button type="button" onClick={() => setForm(f => ({ ...f, items: [...f.items, emptyItem()] }))} className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1">
                    <Plus size={13} /> Add Item
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium text-gray-600 w-1/2">Service / Description</th>
                        <th className="text-center px-2 py-2 font-medium text-gray-600 w-16">Qty</th>
                        <th className="text-right px-2 py-2 font-medium text-gray-600 w-28">Rate (₹)</th>
                        <th className="text-right px-3 py-2 font-medium text-gray-600 w-28">Amount</th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {form.items.map((it, idx) => {
                        const amt = (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0);
                        return (
                          <tr key={it.id}>
                            <td className="px-2 py-1.5">
                              <input className="input py-1 text-xs" placeholder="e.g. Recruitment Service" value={it.description} onChange={e => setItem(idx, 'description', e.target.value)} />
                            </td>
                            <td className="px-2 py-1.5">
                              <input type="number" min="0" step="0.5" className="input py-1 text-xs text-center" value={it.qty} onChange={e => setItem(idx, 'qty', e.target.value)} />
                            </td>
                            <td className="px-2 py-1.5">
                              <input type="number" min="0" className="input py-1 text-xs text-right" placeholder="0" value={it.rate} onChange={e => setItem(idx, 'rate', e.target.value)} />
                            </td>
                            <td className="px-3 py-1.5 text-right text-gray-700 font-medium text-xs">{fmt(amt)}</td>
                            <td className="pr-2 py-1.5 text-center">
                              {form.items.length > 1 && (
                                <button type="button" onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))} className="text-red-400 hover:text-red-600">
                                  <X size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="flex items-center justify-between gap-8 w-56 pt-2 border-t border-gray-200 font-bold text-brand-700 text-base">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="label">Notes / Payment Terms</label>
                <textarea className="input" rows={2} placeholder="e.g. Please transfer to bank account within 7 days." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={!form.clientId || form.items.every(it => !it.description.trim())} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {editing ? 'Save Changes' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (() => {
        const inv = viewing;
        const client = clients.find(c => c.id === inv.clientId);
        return (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-8 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 font-mono">{inv.invoiceNumber}</h2>
                  <span className={`badge text-xs ${STATUS_COLORS[inv.status]}`}>{inv.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => printInvoice(inv, client?.name ?? 'Client', client?.phone ?? '', client?.email ?? '')} className="btn-secondary text-xs">
                    <Printer size={14} /> Print / PDF
                  </button>
                  <button onClick={() => { setViewing(null); openEdit(inv); }} className="btn-secondary text-xs">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-600 ml-1"><X size={20} /></button>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Meta */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Client</p>
                    <p className="font-semibold text-gray-900">{client?.name ?? '—'}</p>
                    {client?.phone && <p className="text-gray-500 text-xs">{client.phone}</p>}
                    {client?.email && <p className="text-gray-500 text-xs">{client.email}</p>}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Billing Month</p>
                    <p className="font-semibold text-gray-900">{fmtMonth(inv.month) || '—'}</p>
                    <p className="text-xs text-gray-500 mt-1">Date: {inv.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Amount</p>
                    <p className="text-xl font-bold text-brand-700">{fmt(inv.total)}</p>
                    {inv.paidDate && <p className="text-xs text-green-600 mt-0.5">Paid on {inv.paidDate}</p>}
                  </div>
                </div>

                {/* Description */}
                {inv.description && (
                  <div className="bg-brand-50 border-l-4 border-brand-600 rounded-r-lg px-4 py-2.5 text-sm text-gray-700">
                    <span className="font-medium text-gray-500">Re: </span>{inv.description}
                  </div>
                )}

                {/* Items */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-600">#</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Service / Description</th>
                        <th className="text-center px-4 py-2.5 font-semibold text-gray-600">Qty</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Rate</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {inv.items.map((it, i) => (
                        <tr key={it.id}>
                          <td className="px-4 py-2.5 text-gray-500">{i + 1}</td>
                          <td className="px-4 py-2.5 text-gray-900">{it.description}</td>
                          <td className="px-4 py-2.5 text-center text-gray-700">{it.qty}</td>
                          <td className="px-4 py-2.5 text-right text-gray-700">{fmt(it.rate)}</td>
                          <td className="px-4 py-2.5 text-right font-medium text-gray-900">{fmt(it.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 border-t-2 border-gray-300">
                        <td colSpan={4} className="px-4 py-3 text-right font-bold text-brand-700">Total</td>
                        <td className="px-4 py-3 text-right font-bold text-brand-700 text-base">{fmt(inv.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {inv.notes && (
                  <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">Notes / Terms</p>
                    <p className="whitespace-pre-wrap">{inv.notes}</p>
                  </div>
                )}

                {inv.status !== 'Paid' && inv.status !== 'Cancelled' && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const now = new Date().toISOString();
                        const updated = { ...inv, status: 'Paid' as InvoiceStatus, paidDate: todayStr(), updatedAt: now };
                        updateInvoice(updated);
                        setViewing(updated);
                      }}
                      className="btn-primary bg-green-600 hover:bg-green-700 text-sm"
                    >
                      <CheckCircle2 size={15} /> Mark as Paid
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
