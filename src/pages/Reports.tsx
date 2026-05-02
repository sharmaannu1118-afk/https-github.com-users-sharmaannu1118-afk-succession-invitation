import { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { FileSpreadsheet, Search, Download } from 'lucide-react';
import { exportAllToSheets } from '../utils/exportToSheets';
import { exportCsv } from '../utils/exportCsv';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const fmt = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;
const pct = (n: number, d: number) => d > 0 ? `${Math.round((n / d) * 100)}%` : '0%';
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const PIE_COLORS = ['#3a5bdb','#6366f1','#22c55e','#f59e0b','#f97316','#ef4444','#14b8a6','#ec4899'];
const STAGE_COLORS: Record<string,string> = {
  New:'#3b82f6', Contacted:'#8b5cf6', Qualified:'#6366f1',
  'Proposal Sent':'#f59e0b', Negotiation:'#f97316', Won:'#22c55e', Lost:'#ef4444',
};

const TABS = ['Overview','Clients','Contacts','Leads','Tasks','Candidates','Job Orders','Placements','Activities'] as const;
type Tab = typeof TABS[number];

function Badge({ label, color }: { label: string; color: string }) {
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: color + '22', color }}>{label}</span>;
}

function statusColor(s: string): string {
  const m: Record<string, string> = {
    Active:'#22c55e', Inactive:'#94a3b8', Prospect:'#f59e0b',
    Won:'#22c55e', Lost:'#ef4444', New:'#3b82f6', Contacted:'#8b5cf6',
    Qualified:'#6366f1', 'Proposal Sent':'#f59e0b', Negotiation:'#f97316',
    Open:'#22c55e', Closed:'#94a3b8', 'On Hold':'#eab308', Cancelled:'#ef4444',
    'In Progress':'#3b82f6', Completed:'#22c55e', Planned:'#6366f1',
    Shortlisted:'#3b82f6', Interviewed:'#8b5cf6', Hired:'#22c55e',
    Rejected:'#ef4444', Blocked:'#dc2626', Pending:'#9ca3af',
    Confirmed:'#22c55e', Joined:'#16a34a', Dropped:'#ef4444',
    Draft:'#94a3b8', Incomplete:'#f97316', 'Under Review':'#8b5cf6',
    'Not Started':'#9ca3af',
  };
  return m[s] ?? '#6b7280';
}

function Table({ headers, rows }: { headers: string[]; rows: (string | number | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map(h => <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} className="px-3 py-10 text-center text-gray-400 text-sm">No data found</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
              {row.map((cell, j) => <td key={j} className="px-3 py-2.5 text-gray-700 whitespace-nowrap">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KPI({ label, value, sub, color = '#1e3a8a' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Reports() {
  const { leads, clients, contacts, candidates, placements, jobOrders, activities, tasks } = useCRM();
  const [tab, setTab] = useState<Tab>('Overview');
  const [search, setSearch] = useState('');

  function handleExport() {
    exportAllToSheets({ clients, contacts, leads, tasks, candidates, jobOrders, placements, activities });
  }

  const today = new Date().toISOString().slice(0, 10);
  const q = search.toLowerCase();

  // ── Overview metrics ──────────────────────────────────────────────────────
  const wonLeads     = leads.filter(l => l.stage === 'Won').length;
  const lostLeads    = leads.filter(l => l.stage === 'Lost').length;
  const activeLeads  = leads.filter(l => !['Won','Lost'].includes(l.stage)).length;
  const totalPipeline= leads.filter(l => !['Won','Lost'].includes(l.stage)).reduce((s,l)=>s+l.value,0);
  const wonRevenue   = leads.filter(l => l.stage === 'Won').reduce((s,l)=>s+l.value,0);
  const totalFees    = placements.reduce((s,p)=>s+p.fee,0);
  const invoicedFees = placements.filter(p=>p.invoiced).reduce((s,p)=>s+p.fee,0);
  const overdueTasks = tasks.filter(t => t.status !== 'Completed' && t.dueDate < today).length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;

  // Monthly data
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    return {
      month: MONTHS[d.getMonth()],
      leads: leads.filter(l => l.createdAt?.startsWith(key)).length,
      fees:  placements.filter(p => p.offerDate?.startsWith(key)).reduce((s,p)=>s+p.fee,0),
    };
  });

  const stageData = ['New','Contacted','Qualified','Proposal Sent','Negotiation','Won','Lost']
    .map(s => ({ stage: s, count: leads.filter(l=>l.stage===s).length })).filter(d=>d.count>0);

  const taskStatusData = ['Draft','Not Started','Pending','In Progress','Under Review','On Hold','Blocked','Incomplete','Completed']
    .map(s => ({ status: s, count: tasks.filter(t=>t.status===s).length })).filter(d=>d.count>0);

  const candidateStatusMap = candidates.reduce<Record<string,number>>((a,c)=>{ a[c.status]=(a[c.status]??0)+1; return a; },{});
  const candidateStatusData = Object.entries(candidateStatusMap).map(([n,v])=>({name:n,value:v}));

  const industryMap = clients.reduce<Record<string,number>>((a,c)=>{ a[c.industry]=(a[c.industry]??0)+1; return a; },{});
  const industryData = Object.entries(industryMap).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([n,v])=>({name:n,value:v}));

  // ── Per-tab filtered data ─────────────────────────────────────────────────
  const filteredClients = clients.filter(c =>
    !q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) ||
    c.city.toLowerCase().includes(q) || c.status.toLowerCase().includes(q));

  const filteredContacts = contacts.filter(c =>
    !q || `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q) || (c.location??'').toLowerCase().includes(q) || c.role.toLowerCase().includes(q));

  const filteredLeads = leads.filter(l =>
    !q || l.companyName.toLowerCase().includes(q) || l.stage.toLowerCase().includes(q) ||
    l.location.toLowerCase().includes(q) || l.source.toLowerCase().includes(q) ||
    (l.contactPerson??'').toLowerCase().includes(q));

  const filteredTasks = tasks.filter(t =>
    !q || t.title.toLowerCase().includes(q) || t.status.toLowerCase().includes(q) ||
    t.priority.toLowerCase().includes(q) || (t.relatedName??'').toLowerCase().includes(q));

  const filteredCandidates = candidates.filter(c =>
    !q || `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
    c.currentTitle.toLowerCase().includes(q) || c.status.toLowerCase().includes(q) ||
    c.location.toLowerCase().includes(q) || (c.currentCompany??'').toLowerCase().includes(q));

  const filteredJobs = jobOrders.filter(j =>
    !q || j.title.toLowerCase().includes(q) || j.status.toLowerCase().includes(q) ||
    j.location.toLowerCase().includes(q) || j.type.toLowerCase().includes(q));

  const filteredPlacements = placements.filter(p => {
    const cand = candidates.find(c=>c.id===p.candidateId);
    const job  = jobOrders.find(j=>j.id===p.jobOrderId);
    const client = clients.find(c=>c.id===p.clientId);
    return !q || (cand ? `${cand.firstName} ${cand.lastName}`.toLowerCase().includes(q) : false) ||
      (job?.title??'').toLowerCase().includes(q) ||
      (client?.name??'').toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q);
  });

  const filteredActivities = activities.filter(a =>
    !q || a.subject.toLowerCase().includes(q) || a.type.toLowerCase().includes(q) ||
    a.relatedName.toLowerCase().includes(q) || a.status.toLowerCase().includes(q));

  function exportTab() {
    if (tab === 'Clients')     exportCsv('Report-Clients.csv', filteredClients.map(c => ({ Name:c.name, Industry:c.industry, Status:c.status, City:c.city, Phone:c.phone??'', Email:c.email??'', 'Account Manager':c.accountManager, 'Created On':c.createdAt })));
    if (tab === 'Contacts')    exportCsv('Report-Contacts.csv', filteredContacts.map(c => ({ 'First Name':c.firstName,'Last Name':c.lastName,Role:c.role,Email:c.email,Phone:c.phone??'',Location:c.location??'','Created On':c.createdAt })));
    if (tab === 'Leads')       exportCsv('Report-Leads.csv', filteredLeads.map(l => ({ Company:l.companyName,Stage:l.stage,Temperature:l.temperature,Source:l.source,Location:l.location,'Deal Value':l.value,'Probability%':l.probability,'Close Date':l.expectedCloseDate,'Created On':l.createdAt })));
    if (tab === 'Tasks')       exportCsv('Report-Tasks.csv', filteredTasks.map(t => ({ Title:t.title,Status:t.status,Priority:t.priority,'Related To':t.relatedName??'','Due Date':t.dueDate,'Completed Date':t.completedDate??'','Created On':t.createdAt })));
    if (tab === 'Candidates')  exportCsv('Report-Candidates.csv', filteredCandidates.map(c => ({ Name:`${c.firstName} ${c.lastName}`,Title:c.currentTitle,Company:c.currentCompany??'',Level:c.experienceLevel,Status:c.status,Location:c.location,'Expected Salary':c.expectedSalary??'','Created On':c.createdAt })));
    if (tab === 'Job Orders')  exportCsv('Report-Jobs.csv', filteredJobs.map(j => ({ Title:j.title,Status:j.status,Type:j.type,Priority:j.priority,Openings:j.openings,Location:j.location,Recruiter:j.recruiter,'Created On':j.createdAt })));
    if (tab === 'Placements')  exportCsv('Report-Placements.csv', filteredPlacements.map(p => ({ Candidate:candidates.find(c=>c.id===p.candidateId) ? `${candidates.find(c=>c.id===p.candidateId)!.firstName} ${candidates.find(c=>c.id===p.candidateId)!.lastName}` : p.candidateId, Job:jobOrders.find(j=>j.id===p.jobOrderId)?.title??p.jobOrderId, Client:clients.find(c=>c.id===p.clientId)?.name??p.clientId, Status:p.status, 'Offer Date':p.offerDate,'Joining Date':p.joiningDate??'','Fee (₹)':p.fee,Invoiced:p.invoiced?'Yes':'No' })));
    if (tab === 'Activities')  exportCsv('Report-Activities.csv', filteredActivities.map(a => ({ Type:a.type,Subject:a.subject,'Related To':a.relatedName,Status:a.status,'Due Date':a.dueDate,'Completed':a.completedAt??'','Assigned To':a.assignedTo })));
  }

  return (
    <div className="space-y-4">

      {/* ── Top bar: Export All ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div>
          <p className="font-semibold text-green-900 text-sm">Export your entire CRM to Google Sheets</p>
          <p className="text-xs text-green-700 mt-0.5">Downloads an .xlsx file with 8 tabs: Clients, Contacts, Leads, Tasks, Candidates, Jobs, Placements, Activities</p>
        </div>
        <button onClick={handleExport} style={{ background:'#16a34a', borderColor:'#16a34a' }}
          className="btn-primary flex items-center gap-2 flex-shrink-0">
          <FileSpreadsheet size={16} /> Export All to Google Sheets (.xlsx)
        </button>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1 bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm">
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setSearch(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === t ? 'bg-brand-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ══════════════════════════ OVERVIEW TAB ═══════════════════════════ */}
      {tab === 'Overview' && (
        <div className="space-y-6">
          {/* KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPI label="Total Clients"      value={clients.length}      sub={`${clients.filter(c=>c.status==='Active').length} active`}       color="#1e3a8a" />
            <KPI label="Total Contacts"     value={contacts.length}     sub="in CRM"                                                           color="#4f46e5" />
            <KPI label="Total Leads"        value={leads.length}        sub={`${activeLeads} active · ${wonLeads} won`}                        color="#7c3aed" />
            <KPI label="Total Candidates"   value={candidates.length}   sub={`${candidates.filter(c=>c.status==='Hired').length} hired`}       color="#0d9488" />
            <KPI label="Job Orders"         value={jobOrders.length}    sub={`${jobOrders.filter(j=>j.status==='Open').length} open`}          color="#d97706" />
            <KPI label="Placements"         value={placements.length}   sub={`${placements.filter(p=>p.status==='Joined').length} joined`}     color="#16a34a" />
            <KPI label="Total Tasks"        value={tasks.length}        sub={`${completedTasks} done · ${overdueTasks} overdue`}               color="#2563eb" />
            <KPI label="Activities"         value={activities.length}   sub={`${activities.filter(a=>a.status==='Completed').length} completed`}color="#64748b" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPI label="Total Pipeline"   value={fmt(totalPipeline)} sub={`${activeLeads} active leads`} color="#1e3a8a" />
            <KPI label="Won Revenue"      value={fmt(wonRevenue)}    sub={`${wonLeads}W / ${lostLeads}L — Win rate: ${pct(wonLeads,wonLeads+lostLeads)}`} color="#16a34a" />
            <KPI label="Total Fees"       value={fmt(totalFees)}     sub="all placements" color="#0d9488" />
            <KPI label="Fees Collected"   value={fmt(invoicedFees)}  sub={`${fmt(totalFees-invoicedFees)} pending`} color="#16a34a" />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly leads & fees */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-3">Monthly Leads Added & Fees (last 6 months)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="l" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v, name) => name === 'Fees (₹)' ? fmt(v as number) : v} />
                  <Bar yAxisId="l" dataKey="leads" name="Leads Added" fill="#6366f1" radius={[4,4,0,0]} />
                  <Bar yAxisId="r" dataKey="fees"  name="Fees (₹)"   fill="#22c55e" radius={[4,4,0,0]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Leads by stage */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-3">Leads by Stage</p>
              {stageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={stageData} dataKey="count" nameKey="stage" cx="50%" cy="50%" outerRadius={75} paddingAngle={2}>
                      {stageData.map((entry) => <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage]??'#94a3b8'} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={9} wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-400 text-sm py-10">No leads yet</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tasks by status */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-3">Tasks by Status</p>
              {taskStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={190}>
                  <BarChart data={taskStatusData} layout="vertical" barSize={14}>
                    <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="status" tick={{ fontSize: 10 }} width={72} />
                    <Tooltip />
                    <Bar dataKey="count" name="Tasks" radius={[0,4,4,0]}>
                      {taskStatusData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-400 text-sm py-10">No tasks yet</p>}
            </div>

            {/* Candidates by status */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-3">Candidates by Status</p>
              {candidateStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie data={candidateStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} paddingAngle={2}>
                      {candidateStatusData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={9} wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-400 text-sm py-10">No candidates yet</p>}
            </div>

            {/* Clients by industry */}
            <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-3">Clients by Industry</p>
              {industryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie data={industryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} paddingAngle={2}>
                      {industryData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={9} wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-400 text-sm py-10">No clients yet</p>}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ DATA TABLE TABS ════════════════════════════════ */}
      {tab !== 'Overview' && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-8 text-sm" placeholder={`Search ${tab}…`}
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <span className="text-xs text-gray-500 ml-1">
              {tab === 'Clients'    && `${filteredClients.length} record${filteredClients.length !== 1 ? 's' : ''}`}
              {tab === 'Contacts'   && `${filteredContacts.length} record${filteredContacts.length !== 1 ? 's' : ''}`}
              {tab === 'Leads'      && `${filteredLeads.length} record${filteredLeads.length !== 1 ? 's' : ''}`}
              {tab === 'Tasks'      && `${filteredTasks.length} record${filteredTasks.length !== 1 ? 's' : ''}`}
              {tab === 'Candidates' && `${filteredCandidates.length} record${filteredCandidates.length !== 1 ? 's' : ''}`}
              {tab === 'Job Orders' && `${filteredJobs.length} record${filteredJobs.length !== 1 ? 's' : ''}`}
              {tab === 'Placements' && `${filteredPlacements.length} record${filteredPlacements.length !== 1 ? 's' : ''}`}
              {tab === 'Activities' && `${filteredActivities.length} record${filteredActivities.length !== 1 ? 's' : ''}`}
            </span>
            <button onClick={exportTab} className="btn-secondary flex items-center gap-1.5 text-xs ml-auto">
              <Download size={13} /> Export CSV
            </button>
          </div>

          {/* CLIENTS */}
          {tab === 'Clients' && (
            <Table
              headers={['Company Name','Industry','Status','City','Phone','Email','Work Mode','Billing','Account Manager','Created']}
              rows={filteredClients.map(c => [
                <span className="font-semibold text-gray-900">{c.name}</span>,
                c.industry,
                <Badge label={c.status} color={statusColor(c.status)} />,
                c.city,
                c.phone ?? '—',
                c.email ?? '—',
                c.workMode ?? '—',
                c.billingAmount ? `${fmt(c.billingAmount)} / ${c.billingCycle}` : '—',
                c.accountManager,
                c.createdAt,
              ])}
            />
          )}

          {/* CONTACTS */}
          {tab === 'Contacts' && (
            <Table
              headers={['Name','Role','Email','Phone','Location','Primary','Company','Created']}
              rows={filteredContacts.map(c => {
                const company = clients.find(cl => cl.id === c.clientId);
                return [
                  <span className="font-semibold text-gray-900">{c.firstName} {c.lastName}</span>,
                  c.role,
                  c.email,
                  c.phone ?? '—',
                  c.location ?? '—',
                  c.isPrimary ? <Badge label="Primary" color="#16a34a" /> : '—',
                  company?.name ?? '—',
                  c.createdAt,
                ];
              })}
            />
          )}

          {/* LEADS */}
          {tab === 'Leads' && (
            <Table
              headers={['Company','Contact Person','Stage','Temperature','Source','Location','Deal Value','Probability','Assigned To','Close Date','Created']}
              rows={filteredLeads.map(l => [
                <span className="font-semibold text-gray-900">{l.companyName}</span>,
                l.contactPerson ?? '—',
                <Badge label={l.stage} color={statusColor(l.stage)} />,
                <Badge label={l.temperature} color={l.temperature==='Hot'?'#ef4444':l.temperature==='Warm'?'#f97316':'#3b82f6'} />,
                l.source,
                l.location,
                fmt(l.value),
                `${l.probability}%`,
                l.assignedTo,
                l.expectedCloseDate,
                l.createdAt,
              ])}
            />
          )}

          {/* TASKS */}
          {tab === 'Tasks' && (
            <Table
              headers={['Title','Status','Priority','Related To','Assigned To','Due Date','Completed Date','Notes','Created']}
              rows={filteredTasks.map(t => [
                <span className="font-semibold text-gray-900">{t.title}</span>,
                <Badge label={t.status} color={statusColor(t.status)} />,
                <Badge label={t.priority} color={t.priority==='Urgent'?'#ef4444':t.priority==='High'?'#f97316':t.priority==='Medium'?'#3b82f6':'#94a3b8'} />,
                t.relatedName ?? t.relatedTo,
                t.assignedTo,
                <span className={t.dueDate < today && t.status !== 'Completed' ? 'text-red-600 font-semibold' : ''}>{t.dueDate}</span>,
                t.completedDate ?? '—',
                t.notes ? <span className="max-w-[200px] block truncate text-gray-500">{t.notes}</span> : '—',
                t.createdAt,
              ])}
            />
          )}

          {/* CANDIDATES */}
          {tab === 'Candidates' && (
            <Table
              headers={['Name','Current Title','Company','Level','Status','Location','Exp (Yrs)','Current Salary','Expected Salary','Notice Period','Created']}
              rows={filteredCandidates.map(c => [
                <span className="font-semibold text-gray-900">{c.firstName} {c.lastName}</span>,
                c.currentTitle,
                c.currentCompany ?? '—',
                c.experienceLevel,
                <Badge label={c.status} color={statusColor(c.status)} />,
                c.location,
                c.yearsOfExperience,
                c.currentSalary  ? fmt(c.currentSalary)  : '—',
                c.expectedSalary ? fmt(c.expectedSalary) : '—',
                c.noticePeriod ?? '—',
                c.createdAt,
              ])}
            />
          )}

          {/* JOB ORDERS */}
          {tab === 'Job Orders' && (
            <Table
              headers={['Job Title','Status','Type','Priority','Openings','Location','Skills','Recruiter','Deadline','Created']}
              rows={filteredJobs.map(j => [
                <span className="font-semibold text-gray-900">{j.title}</span>,
                <Badge label={j.status} color={statusColor(j.status)} />,
                j.type,
                <Badge label={j.priority} color={j.priority==='Urgent'?'#ef4444':j.priority==='High'?'#f97316':j.priority==='Medium'?'#3b82f6':'#94a3b8'} />,
                j.openings,
                j.location,
                <span className="max-w-[180px] block truncate text-gray-500">{j.skills.join(', ')}</span>,
                j.recruiter,
                j.deadline ?? '—',
                j.createdAt,
              ])}
            />
          )}

          {/* PLACEMENTS */}
          {tab === 'Placements' && (
            <Table
              headers={['Candidate','Job Title','Client','Status','Offer Date','Joining Date','CTC Offered','Fee (₹)','Invoiced','Recruiter','Created']}
              rows={filteredPlacements.map(p => {
                const cand   = candidates.find(c => c.id === p.candidateId);
                const job    = jobOrders.find(j => j.id === p.jobOrderId);
                const client = clients.find(c => c.id === p.clientId);
                return [
                  <span className="font-semibold text-gray-900">{cand ? `${cand.firstName} ${cand.lastName}` : '—'}</span>,
                  job?.title ?? '—',
                  client?.name ?? '—',
                  <Badge label={p.status} color={statusColor(p.status)} />,
                  p.offerDate,
                  p.joiningDate ?? '—',
                  fmt(p.ctcOffered),
                  fmt(p.fee),
                  p.invoiced ? <Badge label="Invoiced" color="#16a34a" /> : <Badge label="Pending" color="#f97316" />,
                  p.recruiter,
                  p.createdAt,
                ];
              })}
            />
          )}

          {/* ACTIVITIES */}
          {tab === 'Activities' && (
            <Table
              headers={['Type','Subject','Related To','Status','Assigned To','Due Date','Completed','Description','Created']}
              rows={filteredActivities.map(a => [
                <Badge label={a.type} color={a.type==='Call'?'#16a34a':a.type==='Email'?'#d97706':a.type==='Meeting'?'#2563eb':a.type==='Note'?'#64748b':'#7c3aed'} />,
                <span className="font-semibold text-gray-900">{a.subject}</span>,
                a.relatedName,
                <Badge label={a.status} color={statusColor(a.status)} />,
                a.assignedTo,
                a.dueDate,
                a.completedAt ?? '—',
                a.description ? <span className="max-w-[200px] block truncate text-gray-500">{a.description}</span> : '—',
                a.createdAt,
              ])}
            />
          )}
        </div>
      )}
    </div>
  );
}
