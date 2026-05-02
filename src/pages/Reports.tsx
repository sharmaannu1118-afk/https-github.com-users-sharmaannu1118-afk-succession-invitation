import { useCRM } from '../context/CRMContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import { FileSpreadsheet } from 'lucide-react';
import { exportAllToSheets } from '../utils/exportToSheets';

const fmt  = (n: number) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;
const pct  = (n: number, d: number) => d > 0 ? `${Math.round((n/d)*100)}%` : '0%';

const STAGE_COLORS: Record<string, string> = {
  New: '#3b82f6', Qualified: '#6366f1', 'Proposal Sent': '#f59e0b',
  Negotiation: '#f97316', Won: '#22c55e', Lost: '#ef4444',
};
const PIE_COLORS = ['#3a5bdb','#6366f1','#22c55e','#f59e0b','#f97316','#ef4444'];

const MONTHLY_REVENUE = [
  { month: 'Oct', revenue: 120000, fees: 80000 },
  { month: 'Nov', revenue: 180000, fees: 130000 },
  { month: 'Dec', revenue: 240000, fees: 180000 },
  { month: 'Jan', revenue: 320000, fees: 250000 },
  { month: 'Feb', revenue: 210000, fees: 160000 },
  { month: 'Mar', revenue: 520000, fees: 400000 },
  { month: 'Apr', revenue: 270000, fees: 200000 },
];

function StatCard({ label, value, sub, color = 'text-gray-900' }: {
  label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div className="card p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Reports() {
  const { leads, clients, contacts, candidates, placements, jobOrders, activities, tasks } = useCRM();

  // ── Lead metrics ──────────────────────────────────────────────────────────
  const wonLeads     = leads.filter(l => l.stage === 'Won').length;
  const lostLeads    = leads.filter(l => l.stage === 'Lost').length;
  const activeLeads  = leads.filter(l => !['Won','Lost'].includes(l.stage)).length;
  const convRate     = pct(wonLeads, wonLeads + lostLeads);
  const totalPipeline= leads.filter(l => !['Won','Lost'].includes(l.stage)).reduce((s,l)=>s+l.value,0);
  const wonRevenue   = leads.filter(l => l.stage === 'Won').reduce((s,l)=>s+l.value,0);
  const avgDealSize  = wonLeads > 0 ? wonRevenue / wonLeads : 0;

  // ── Placement metrics ─────────────────────────────────────────────────────
  const totalFees    = placements.reduce((s,p)=>s+p.fee,0);
  const invoicedFees = placements.filter(p=>p.invoiced).reduce((s,p)=>s+p.fee,0);
  const pendingFees  = totalFees - invoicedFees;
  const joinedCount  = placements.filter(p=>p.status==='Joined').length;

  // ── Stage distribution ────────────────────────────────────────────────────
  const stageData = Object.keys(STAGE_COLORS).map(stage => ({
    stage, count: leads.filter(l=>l.stage===stage).length,
    value: leads.filter(l=>l.stage===stage).reduce((s,l)=>s+l.value,0),
  }));

  // ── Source distribution ───────────────────────────────────────────────────
  const sourceMap = leads.reduce<Record<string,number>>((acc,l)=>{
    acc[l.source] = (acc[l.source] ?? 0) + 1; return acc;
  }, {});
  const sourceData = Object.entries(sourceMap).map(([name, value]) => ({ name, value }));

  // ── Recruiter performance ─────────────────────────────────────────────────
  const recruiters = [...new Set([
    ...leads.map(l=>l.assignedTo),
    ...placements.map(p=>p.recruiter),
  ])];
  const recruiterData = recruiters.map(r => ({
    name: r.split(' ')[0],
    leads:       leads.filter(l=>l.assignedTo===r).length,
    wonLeads:    leads.filter(l=>l.assignedTo===r && l.stage==='Won').length,
    placements:  placements.filter(p=>p.recruiter===r).length,
    fees:        placements.filter(p=>p.recruiter===r).reduce((s,p)=>s+p.fee,0),
  }));

  // ── Activity breakdown ────────────────────────────────────────────────────
  const actTypeData = ['Call','Email','Meeting','Note','Task'].map(type => ({
    type, count: activities.filter(a=>a.type===type).length,
    done: activities.filter(a=>a.type===type && a.status==='Completed').length,
  }));

  // ── Industry distribution ─────────────────────────────────────────────────
  const industryMap = clients.reduce<Record<string,number>>((acc,c)=>{
    acc[c.industry] = (acc[c.industry] ?? 0) + 1; return acc;
  }, {});
  const industryData = Object.entries(industryMap).map(([name, value]) => ({ name, value }));

  // ── Candidate by level ────────────────────────────────────────────────────
  const levelData = ['Entry','Mid','Senior','Lead','Director','C-Suite'].map(level => ({
    level, count: candidates.filter(c=>c.experienceLevel===level).length
  })).filter(d=>d.count > 0);

  function handleExport() {
    exportAllToSheets({ clients, contacts, leads, tasks, candidates, jobOrders, placements, activities });
  }

  return (
    <div className="space-y-6">

      {/* Export to Google Sheets */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700 border-green-600"
          style={{ background: '#16a34a', borderColor: '#16a34a' }}
        >
          <FileSpreadsheet size={16} />
          Export All to Google Sheets (.xlsx)
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Pipeline" value={fmt(totalPipeline)} sub={`${activeLeads} active leads`} color="text-brand-700" />
        <StatCard label="Won Revenue" value={fmt(wonRevenue)} sub={`${wonLeads} deals won`} color="text-green-700" />
        <StatCard label="Win Rate" value={convRate} sub={`${wonLeads}W / ${lostLeads}L`} color="text-purple-700" />
        <StatCard label="Avg. Deal Size" value={fmt(avgDealSize)} sub="per won deal" />
        <StatCard label="Total Fees" value={fmt(totalFees)} sub="all placements" color="text-teal-700" />
        <StatCard label="Fees Collected" value={fmt(invoicedFees)} sub={`${placements.filter(p=>p.invoiced).length} invoiced`} color="text-green-700" />
        <StatCard label="Fees Pending" value={fmt(pendingFees)} sub="not yet invoiced" color="text-orange-600" />
        <StatCard label="Candidates Placed" value={joinedCount} sub="joined & confirmed" color="text-indigo-700" />
      </div>

      {/* Revenue trend */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Monthly Revenue & Fees</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MONTHLY_REVENUE}>
            <defs>
              <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3a5bdb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3a5bdb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="feeG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
            <Tooltip formatter={(v) => fmt(v as number)} />
            <Area type="monotone" dataKey="revenue" stroke="#3a5bdb" fill="url(#revG)" strokeWidth={2} name="Revenue" />
            <Area type="monotone" dataKey="fees"    stroke="#22c55e" fill="url(#feeG)" strokeWidth={2} name="Fees Collected" />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stage + Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Leads by Stage</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stageData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Leads" radius={[4,4,0,0]}>
                {stageData.map((entry) => (
                  <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] ?? '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Lead Sources</h3>
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
        </div>
      </div>

      {/* Recruiter performance table */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Team Performance</h3>
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
                      <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                        {r.name[0]}
                      </div>
                      {r.name}
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

      {/* Activity + Industry + Candidate level */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Activity breakdown */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Activity Breakdown</h3>
          <div className="space-y-3">
            {actTypeData.filter(d=>d.count > 0).map(d => (
              <div key={d.type}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-gray-700">{d.type}</span>
                  <span className="text-gray-500">{d.done}/{d.count} done</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-brand-500 h-2 rounded-full transition-all"
                    style={{ width: `${d.count > 0 ? Math.round((d.done/d.count)*100) : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client industries */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Clients by Industry</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={industryData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={70} paddingAngle={2}>
                {industryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend iconSize={9} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Candidate levels */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Candidates by Level</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={levelData} layout="vertical" barSize={16}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="level" tick={{ fontSize: 11 }} width={55} />
              <Tooltip />
              <Bar dataKey="count" name="Candidates" fill="#6366f1" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Job orders summary */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Job Orders Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {['Open','In Progress','On Hold','Closed','Cancelled'].map(status => (
            <div key={status} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900">{jobOrders.filter(j=>j.status===status).length}</p>
              <p className="text-xs text-gray-500 mt-0.5">{status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
