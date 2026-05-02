import { useCRM } from '../context/CRMContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { FileSpreadsheet, Users, Building2, TrendingUp, CheckSquare, UserSearch, Briefcase, Award, CalendarCheck } from 'lucide-react';
import { exportAllToSheets } from '../utils/exportToSheets';

const fmt  = (n: number) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;
const pct  = (n: number, d: number) => d > 0 ? `${Math.round((n/d)*100)}%` : '0%';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STAGE_COLORS: Record<string, string> = {
  New: '#3b82f6', Contacted: '#8b5cf6', Qualified: '#6366f1',
  'Proposal Sent': '#f59e0b', Negotiation: '#f97316', Won: '#22c55e', Lost: '#ef4444',
};
const PIE_COLORS = ['#3a5bdb','#6366f1','#22c55e','#f59e0b','#f97316','#ef4444','#14b8a6','#ec4899'];

const TASK_COLORS: Record<string, string> = {
  Draft: '#94a3b8', 'Not Started': '#9ca3af', Pending: '#6b7280',
  'In Progress': '#3b82f6', 'Under Review': '#8b5cf6', 'On Hold': '#eab308',
  Blocked: '#ef4444', Incomplete: '#f97316', Completed: '#22c55e',
};

function StatCard({ label, value, sub, color = 'text-gray-900', icon }: {
  label: string; value: string | number; sub?: string; color?: string; icon?: React.ReactNode;
}) {
  return (
    <div className="card p-4 flex items-start gap-3">
      {icon && <div className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</div>}
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h3>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

export default function Reports() {
  const { leads, clients, contacts, candidates, placements, jobOrders, activities, tasks } = useCRM();

  // ── CRM Overview counts ───────────────────────────────────────────────────
  const totalClients    = clients.length;
  const activeClients   = clients.filter(c => c.status === 'Active').length;
  const totalContacts   = contacts.length;
  const totalLeads      = leads.length;
  const totalCandidates = candidates.length;
  const totalJobs       = jobOrders.length;
  const openJobs        = jobOrders.filter(j => j.status === 'Open').length;
  const totalTasks      = tasks.length;
  const totalPlacements = placements.length;
  const totalActivities = activities.length;

  // ── Lead metrics ──────────────────────────────────────────────────────────
  const wonLeads     = leads.filter(l => l.stage === 'Won').length;
  const lostLeads    = leads.filter(l => l.stage === 'Lost').length;
  const activeLeads  = leads.filter(l => !['Won','Lost'].includes(l.stage)).length;
  const convRate     = pct(wonLeads, wonLeads + lostLeads);
  const totalPipeline= leads.filter(l => !['Won','Lost'].includes(l.stage)).reduce((s,l)=>s+l.value,0);
  const wonRevenue   = leads.filter(l => l.stage === 'Won').reduce((s,l)=>s+l.value,0);
  const avgDealSize  = wonLeads > 0 ? wonRevenue / wonLeads : 0;

  // ── Placement / fee metrics ───────────────────────────────────────────────
  const totalFees    = placements.reduce((s,p)=>s+p.fee,0);
  const invoicedFees = placements.filter(p=>p.invoiced).reduce((s,p)=>s+p.fee,0);
  const pendingFees  = totalFees - invoicedFees;
  const joinedCount  = placements.filter(p=>p.status==='Joined').length;

  // ── Monthly pipeline (last 6 months from leads.createdAt) ────────────────
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const monthLeads  = leads.filter(l => l.createdAt?.startsWith(key));
    const monthPlaced = placements.filter(p => p.offerDate?.startsWith(key));
    return {
      month: MONTHS[d.getMonth()],
      leads:    monthLeads.length,
      pipeline: monthLeads.reduce((s,l)=>s+l.value,0),
      fees:     monthPlaced.reduce((s,p)=>s+p.fee,0),
    };
  });

  // ── Task breakdown ────────────────────────────────────────────────────────
  const taskStatuses = ['Draft','Not Started','Pending','In Progress','Under Review','On Hold','Blocked','Incomplete','Completed'];
  const taskData = taskStatuses.map(s => ({
    status: s,
    count: tasks.filter(t => t.status === s).length,
    color: TASK_COLORS[s] ?? '#94a3b8',
  })).filter(d => d.count > 0);

  const today = new Date().toISOString().slice(0,10);
  const overdueTasks  = tasks.filter(t => t.status !== 'Completed' && t.dueDate < today).length;
  const completedTasks= tasks.filter(t => t.status === 'Completed').length;
  const pendingTasks  = tasks.filter(t => ['Pending','Not Started','Draft'].includes(t.status)).length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

  // ── Stage distribution ────────────────────────────────────────────────────
  const stageData = ['New','Contacted','Qualified','Proposal Sent','Negotiation','Won','Lost'].map(stage => ({
    stage, count: leads.filter(l=>l.stage===stage).length,
  })).filter(d => d.count > 0);

  // ── Source distribution ───────────────────────────────────────────────────
  const sourceMap = leads.reduce<Record<string,number>>((acc,l)=>{
    acc[l.source] = (acc[l.source] ?? 0) + 1; return acc;
  }, {});
  const sourceData = Object.entries(sourceMap).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name, value]) => ({ name, value }));

  // ── Candidate by status ───────────────────────────────────────────────────
  const candidateStatusMap = candidates.reduce<Record<string,number>>((acc,c)=>{
    acc[c.status] = (acc[c.status] ?? 0) + 1; return acc;
  }, {});
  const candidateStatusData = Object.entries(candidateStatusMap).map(([name, value]) => ({ name, value }));

  // ── Candidate by level ────────────────────────────────────────────────────
  const levelData = ['Entry','Mid','Senior','Lead','Director','C-Suite'].map(level => ({
    level, count: candidates.filter(c=>c.experienceLevel===level).length
  })).filter(d=>d.count > 0);

  // ── Industry distribution ─────────────────────────────────────────────────
  const industryMap = clients.reduce<Record<string,number>>((acc,c)=>{
    acc[c.industry] = (acc[c.industry] ?? 0) + 1; return acc;
  }, {});
  const industryData = Object.entries(industryMap).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name, value]) => ({ name, value }));

  // ── Activity breakdown ────────────────────────────────────────────────────
  const actTypeData = ['Call','Email','Meeting','Note','Task'].map(type => ({
    type, count: activities.filter(a=>a.type===type).length,
    done: activities.filter(a=>a.type===type && a.status==='Completed').length,
  })).filter(d => d.count > 0);

  // ── Recruiter performance ─────────────────────────────────────────────────
  const recruiters = [...new Set([...leads.map(l=>l.assignedTo), ...placements.map(p=>p.recruiter)])];
  const recruiterData = recruiters.map(r => ({
    name: r, short: r.split(' ')[0],
    leads:      leads.filter(l=>l.assignedTo===r).length,
    wonLeads:   leads.filter(l=>l.assignedTo===r && l.stage==='Won').length,
    placements: placements.filter(p=>p.recruiter===r).length,
    fees:       placements.filter(p=>p.recruiter===r).reduce((s,p)=>s+p.fee,0),
  })).filter(r => r.leads > 0 || r.placements > 0);

  function handleExport() {
    exportAllToSheets({ clients, contacts, leads, tasks, candidates, jobOrders, placements, activities });
  }

  return (
    <div className="space-y-8">

      {/* ── Export Button ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div>
          <p className="font-semibold text-green-900 text-sm">Export your entire CRM to Google Sheets</p>
          <p className="text-xs text-green-700 mt-0.5">Downloads an .xlsx file with 8 tabs: Clients, Contacts, Leads, Tasks, Candidates, Jobs, Placements, Activities</p>
        </div>
        <button
          onClick={handleExport}
          style={{ background: '#16a34a', borderColor: '#16a34a' }}
          className="btn-primary flex items-center gap-2 flex-shrink-0"
        >
          <FileSpreadsheet size={16} />
          Export All to Google Sheets (.xlsx)
        </button>
      </div>

      {/* ── CRM Overview ──────────────────────────────────────────────────── */}
      <div>
        <SectionTitle title="CRM Overview" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Clients" value={totalClients} sub={`${activeClients} active`} color="text-blue-700" icon={<Building2 size={18} />} />
          <StatCard label="Contacts" value={totalContacts} sub="all contacts" color="text-indigo-700" icon={<Users size={18} />} />
          <StatCard label="Leads" value={totalLeads} sub={`${activeLeads} active`} color="text-purple-700" icon={<TrendingUp size={18} />} />
          <StatCard label="Candidates" value={totalCandidates} sub="in database" color="text-teal-700" icon={<UserSearch size={18} />} />
          <StatCard label="Job Orders" value={totalJobs} sub={`${openJobs} open`} color="text-orange-700" icon={<Briefcase size={18} />} />
          <StatCard label="Placements" value={totalPlacements} sub={`${joinedCount} joined`} color="text-green-700" icon={<Award size={18} />} />
          <StatCard label="Activities" value={totalActivities} sub="all types" color="text-gray-700" icon={<CalendarCheck size={18} />} />
          <StatCard label="Tasks" value={totalTasks} sub={`${completedTasks} completed`} color="text-brand-700" icon={<CheckSquare size={18} />} />
        </div>
      </div>

      {/* ── Pipeline & Revenue ────────────────────────────────────────────── */}
      <div>
        <SectionTitle title="Pipeline & Revenue" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <StatCard label="Total Pipeline" value={fmt(totalPipeline)} sub={`${activeLeads} active leads`} color="text-brand-700" />
          <StatCard label="Won Revenue" value={fmt(wonRevenue)} sub={`${wonLeads} deals won`} color="text-green-700" />
          <StatCard label="Win Rate" value={convRate} sub={`${wonLeads}W / ${lostLeads}L`} color="text-purple-700" />
          <StatCard label="Avg. Deal Size" value={fmt(avgDealSize)} sub="per won deal" />
          <StatCard label="Total Fees" value={fmt(totalFees)} sub="all placements" color="text-teal-700" />
          <StatCard label="Fees Collected" value={fmt(invoicedFees)} sub={`${placements.filter(p=>p.invoiced).length} invoiced`} color="text-green-700" />
          <StatCard label="Fees Pending" value={fmt(pendingFees)} sub="not yet invoiced" color="text-orange-600" />
          <StatCard label="Candidates Placed" value={joinedCount} sub="joined & confirmed" color="text-indigo-700" />
        </div>

        {/* Monthly leads + fees (real data) */}
        <div className="card">
          <p className="text-xs text-gray-400 mb-1">Last 6 months — based on your actual CRM data</p>
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Monthly Leads Added & Fees Earned</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip formatter={(v, name) => name === 'Fees (₹)' ? fmt(v as number) : v} />
              <Bar yAxisId="left" dataKey="leads" name="Leads Added" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar yAxisId="right" dataKey="fees"  name="Fees (₹)"   fill="#22c55e" radius={[4,4,0,0]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Tasks Report ──────────────────────────────────────────────────── */}
      <div>
        <SectionTitle title="Tasks Report" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <StatCard label="Total Tasks"   value={totalTasks}    sub="all statuses"      color="text-gray-800" />
          <StatCard label="In Progress"   value={inProgressTasks} sub="being worked on" color="text-blue-700" />
          <StatCard label="Completed"     value={completedTasks}  sub="done"            color="text-green-700" />
          <StatCard label="Overdue"       value={overdueTasks}    sub="past due date"   color="text-red-600" />
          <StatCard label="Pending"       value={pendingTasks}    sub="not started yet" color="text-gray-600" />
          <StatCard label="Blocked"       value={tasks.filter(t=>t.status==='Blocked').length}      sub="need action"    color="text-red-700" />
          <StatCard label="Under Review"  value={tasks.filter(t=>t.status==='Under Review').length}  sub="being reviewed" color="text-purple-700" />
          <StatCard label="On Hold"       value={tasks.filter(t=>t.status==='On Hold').length}       sub="paused"         color="text-yellow-700" />
        </div>

        {taskData.length > 0 ? (
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Tasks by Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={taskData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Tasks" radius={[4,4,0,0]}>
                  {taskData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card p-8 text-center text-gray-400 text-sm">No tasks added yet</div>
        )}
      </div>

      {/* ── Leads Report ──────────────────────────────────────────────────── */}
      <div>
        <SectionTitle title="Leads & Pipeline Report" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Leads by Stage</h3>
            {stageData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stageData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Leads" radius={[4,4,0,0]}>
                    {stageData.map((entry) => (
                      <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] ?? '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-10">No leads added yet</p>}
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Lead Sources</h3>
            {sourceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={80} paddingAngle={2}>
                    {sourceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-10">No leads added yet</p>}
          </div>
        </div>
      </div>

      {/* ── Candidates Report ─────────────────────────────────────────────── */}
      <div>
        <SectionTitle title="Candidates Report" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Candidates by Status</h3>
            {candidateStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={candidateStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={80} paddingAngle={2}>
                    {candidateStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-10">No candidates added yet</p>}
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Candidates by Experience Level</h3>
            {levelData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={levelData} layout="vertical" barSize={18}>
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="level" tick={{ fontSize: 11 }} width={60} />
                  <Tooltip />
                  <Bar dataKey="count" name="Candidates" fill="#6366f1" radius={[0,4,4,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-10">No candidates added yet</p>}
          </div>
        </div>
      </div>

      {/* ── Clients Report ────────────────────────────────────────────────── */}
      <div>
        <SectionTitle title="Clients Report" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Clients by Industry</h3>
            {industryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={industryData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={85} paddingAngle={2}>
                    {industryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-gray-400 text-center py-10">No clients added yet</p>}
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Clients by Status</h3>
            <div className="space-y-3 mt-2">
              {['Active','Prospect','Inactive'].map(status => {
                const count = clients.filter(c=>c.status===status).length;
                const color = status==='Active' ? '#22c55e' : status==='Prospect' ? '#f59e0b' : '#94a3b8';
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{status}</span>
                      <span className="font-bold" style={{ color }}>{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full transition-all"
                        style={{ width: `${totalClients > 0 ? Math.round((count/totalClients)*100) : 0}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Job Orders & Activities ───────────────────────────────────────── */}
      <div>
        <SectionTitle title="Job Orders & Activities" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Job Orders by Status</h3>
            <div className="grid grid-cols-3 gap-3">
              {['Open','In Progress','On Hold','Closed','Cancelled','Job Position Filled'].map(status => (
                <div key={status} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{jobOrders.filter(j=>j.status===status).length}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{status}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">Activity Breakdown</h3>
            {actTypeData.length > 0 ? (
              <div className="space-y-3">
                {actTypeData.map(d => (
                  <div key={d.type}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{d.type}</span>
                      <span className="text-gray-500">{d.done}/{d.count} completed</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-brand-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.round((d.done/d.count)*100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400 text-center py-8">No activities logged yet</p>}
          </div>
        </div>
      </div>

      {/* ── Team Performance ──────────────────────────────────────────────── */}
      {recruiterData.length > 0 && (
        <div>
          <SectionTitle title="Team Performance" />
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="th">Recruiter</th>
                    <th className="th">Total Leads</th>
                    <th className="th">Won</th>
                    <th className="th">Win Rate</th>
                    <th className="th">Placements</th>
                    <th className="th">Fees Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiterData.map(r => (
                    <tr key={r.name} className="hover:bg-gray-50">
                      <td className="td font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {r.short[0]}
                          </div>
                          {r.short}
                        </div>
                      </td>
                      <td className="td text-gray-600">{r.leads}</td>
                      <td className="td text-green-700 font-semibold">{r.wonLeads}</td>
                      <td className="td">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-2 w-20">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: pct(r.wonLeads, r.leads) }} />
                          </div>
                          <span className="text-xs text-gray-500">{pct(r.wonLeads, r.leads)}</span>
                        </div>
                      </td>
                      <td className="td text-gray-600">{r.placements}</td>
                      <td className="td font-semibold text-brand-700">{fmt(r.fees)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
