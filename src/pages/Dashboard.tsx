import { useCRM } from '../context/CRMContext';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Users, Briefcase, UserSearch,
  Award, AlertTriangle, CheckCircle2, Clock, ArrowRight,
  IndianRupee, Target, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import StatusBadge from '../components/StatusBadge';

const fmt = (n: number) =>
  n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(1)}Cr`
  : n >= 1_00_000   ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

const today = new Date().toISOString().slice(0, 10);
const STAGE_ORDER = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
const FUNNEL_COLORS = ['#3a5bdb','#6366f1','#f59e0b','#f97316','#22c55e','#ef4444'];
const CAND_COLORS   = ['#6366f1','#f59e0b','#22c55e','#94a3b8'];

const revenueData = [
  { month: 'Nov', revenue: 180000, target: 250000 },
  { month: 'Dec', revenue: 240000, target: 250000 },
  { month: 'Jan', revenue: 320000, target: 300000 },
  { month: 'Feb', revenue: 210000, target: 300000 },
  { month: 'Mar', revenue: 520000, target: 400000 },
  { month: 'Apr', revenue: 270000, target: 400000 },
];

export default function Dashboard() {
  const { clients, contacts, leads, jobOrders, candidates, placements, activities, updateActivity } = useCRM();
  const navigate = useNavigate();

  // ── KPIs ────────────────────────────────────────────────────────────────
  const activeClients  = clients.filter(c => c.status === 'Active').length;
  const openJobs       = jobOrders.filter(j => j.status === 'Open' || j.status === 'In Progress').length;
  const activeCands    = candidates.filter(c => !['Rejected','Blacklisted','Withdrawn'].includes(c.status)).length;
  const pipelineValue  = leads.filter(l => !['Won','Lost'].includes(l.stage))
    .reduce((s, l) => s + l.value * (l.probability / 100), 0);
  const feesCollected  = placements.filter(p => p.invoiced).reduce((s, p) => s + p.fee, 0);
  const feesPending    = placements.filter(p => !p.invoiced).reduce((s, p) => s + p.fee, 0);

  // ── Today / Overdue ──────────────────────────────────────────────────────
  const overdueActs    = activities.filter(a => a.status === 'Planned' && a.dueDate < today);
  const todayActs      = activities.filter(a => a.status === 'Planned' && a.dueDate === today);
  const upcomingActs   = activities.filter(a => a.status === 'Planned' && a.dueDate > today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);

  // ── Candidate pool ───────────────────────────────────────────────────────
  const candPool = ['Shortlisted','Interviewed','Hired','On Hold'].map((s, i) => ({
    name: s, value: candidates.filter(c => c.status === s).length, fill: CAND_COLORS[i]
  })).filter(d => d.value > 0);

  // ── Hot leads ────────────────────────────────────────────────────────────
  const hotLeads = leads
    .filter(l => !['Won','Lost'].includes(l.stage))
    .sort((a, b) => b.value * b.probability - a.value * a.probability)
    .slice(0, 4);

  // ── Recent placements ────────────────────────────────────────────────────
  const recentPlacements = [...placements]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  function markDone(act: (typeof activities)[0]) {
    updateActivity({ ...act, status: 'Completed', completedAt: today });
  }

  const kpis = [
    { label: 'Active Clients',    value: activeClients,      icon: Building2,    color: 'bg-brand-600',  link: '/clients' },
    { label: 'Open Job Orders',   value: openJobs,           icon: Briefcase,    color: 'bg-emerald-600', link: '/jobs' },
    { label: 'Active Candidates', value: activeCands,        icon: UserSearch,   color: 'bg-purple-600', link: '/candidates' },
    { label: 'Pipeline (Wtd.)',   value: fmt(pipelineValue), icon: Target,       color: 'bg-orange-500', link: '/leads' },
    { label: 'Fees Collected',    value: fmt(feesCollected), icon: IndianRupee,  color: 'bg-green-600',  link: '/placements' },
    { label: 'Fees Pending',      value: fmt(feesPending),   icon: Clock,        color: 'bg-yellow-500', link: '/placements' },
    { label: 'Total Contacts',    value: contacts.length,    icon: Users,        color: 'bg-indigo-600', link: '/contacts' },
    { label: 'Total Placements',  value: placements.length,  icon: Award,        color: 'bg-teal-600',   link: '/placements' },
  ];

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500 text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold">Good day, Annu! 👋</h2>
          <p className="text-brand-200 text-sm mt-0.5">
            {overdueActs.length > 0
              ? `You have ${overdueActs.length} overdue task${overdueActs.length > 1 ? 's' : ''} — let's clear them first.`
              : todayActs.length > 0
              ? `You have ${todayActs.length} task${todayActs.length > 1 ? 's' : ''} scheduled for today.`
              : 'You\'re all caught up — great work!'}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => navigate('/leads')} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
            <Zap size={14} /> New Lead
          </button>
          <button onClick={() => navigate('/activities')} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
            <CheckCircle2 size={14} /> Log Activity
          </button>
        </div>
      </div>

      {/* Overdue alert */}
      {overdueActs.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-500" />
            <p className="text-sm font-semibold text-red-700">{overdueActs.length} Overdue Task{overdueActs.length > 1 ? 's' : ''}</p>
          </div>
          <div className="space-y-2">
            {overdueActs.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-red-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.subject}</p>
                  <p className="text-xs text-red-500">Due {a.dueDate} · {a.assignedTo}</p>
                </div>
                <button onClick={() => markDone(a)}
                  className="text-xs text-green-600 hover:text-green-800 font-medium flex items-center gap-1">
                  <CheckCircle2 size={14} /> Done
                </button>
              </div>
            ))}
            {overdueActs.length > 3 && (
              <button onClick={() => navigate('/activities')} className="text-xs text-red-600 hover:underline">
                +{overdueActs.length - 3} more overdue →
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(({ label, value, icon: Icon, color, link }) => (
          <button key={label} onClick={() => navigate(link)}
            className="card flex items-center gap-3 p-4 hover:shadow-md transition-shadow text-left">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue vs Target */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Revenue vs Target (Last 6 Months)</h3>
            <button onClick={() => navigate('/reports')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              Full Report <ArrowRight size={12} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a5bdb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3a5bdb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(v) => fmt(v as number)} />
              <Area type="monotone" dataKey="target" stroke="#e5e7eb" fill="none" strokeDasharray="4 2" name="Target" />
              <Area type="monotone" dataKey="revenue" stroke="#3a5bdb" fill="url(#revGrad)" strokeWidth={2.5} name="Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Candidate pool */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Candidate Pool</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={candPool} dataKey="value" nameKey="name" cx="50%" cy="50%"
                innerRadius={55} outerRadius={82} paddingAngle={3}>
                {candPool.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's tasks + Hot Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Today + Upcoming */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">
              Today's Tasks
              {todayActs.length > 0 && (
                <span className="ml-2 w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center inline-flex">{todayActs.length}</span>
              )}
            </h3>
            <button onClick={() => navigate('/activities')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              All <ArrowRight size={12} />
            </button>
          </div>

          {todayActs.length === 0 && upcomingActs.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle2 size={32} className="text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...todayActs, ...upcomingActs].slice(0, 5).map(a => {
                const isToday = a.dueDate === today;
                return (
                  <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border ${isToday ? 'border-brand-200 bg-brand-50' : 'border-gray-100 bg-gray-50'}`}>
                    <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      a.type === 'Call' ? 'bg-green-100 text-green-700'
                      : a.type === 'Meeting' ? 'bg-blue-100 text-blue-700'
                      : a.type === 'Email' ? 'bg-yellow-100 text-yellow-700'
                      : a.type === 'Task' ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>{a.type[0]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{a.subject}</p>
                      <p className="text-xs text-gray-500">{a.relatedName} · {isToday ? 'Today' : a.dueDate}</p>
                    </div>
                    <button onClick={() => markDone(a)}
                      className="flex-shrink-0 text-gray-300 hover:text-green-500 transition-colors" title="Mark done">
                      <CheckCircle2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Hot Leads */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Hot Leads</h3>
            <button onClick={() => navigate('/leads')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              Pipeline <ArrowRight size={12} />
            </button>
          </div>
          {hotLeads.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No active leads. Add one!</p>
          ) : (
            <div className="space-y-3">
              {hotLeads.map(l => {
                const client = clients.find(c => c.id === l.clientId);
                return (
                  <div key={l.id} className="p-3 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{l.title}</p>
                        {client && <p className="text-xs text-gray-500">{client.name}</p>}
                      </div>
                      <StatusBadge value={l.stage} />
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-bold text-brand-700">{fmt(l.value)}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${l.probability}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{l.probability}%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Closes {l.expectedCloseDate} · {l.assignedTo}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Placements + Pipeline funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Placements */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Recent Placements</h3>
            <button onClick={() => navigate('/placements')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              All <ArrowRight size={12} />
            </button>
          </div>
          {recentPlacements.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No placements yet.</p>
          ) : (
            <div className="space-y-3">
              {recentPlacements.map(p => {
                const cand   = candidates.find(c => c.id === p.candidateId);
                const client = clients.find(c => c.id === p.clientId);
                return (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                        {cand?.firstName?.[0] ?? '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {cand ? `${cand.firstName} ${cand.lastName}` : '—'}
                        </p>
                        <p className="text-xs text-gray-500">{client?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge value={p.status} />
                      <p className="text-xs text-gray-500 mt-0.5">{fmt(p.fee)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pipeline Funnel */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Pipeline Funnel</h3>
            <button onClick={() => navigate('/reports')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              Reports <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {STAGE_ORDER.map((stage, i) => {
              const count = leads.filter(l => l.stage === stage).length;
              const value = leads.filter(l => l.stage === stage).reduce((s, l) => s + l.value, 0);
              const pct   = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
              return (
                <div key={stage}>
                  <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                    <span className="font-medium">{stage}</span>
                    <span>{count} leads · {fmt(value)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: FUNNEL_COLORS[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
