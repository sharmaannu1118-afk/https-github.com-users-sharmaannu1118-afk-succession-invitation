import { useCRM } from '../context/CRMContext';
import {
  Building2, Users, TrendingUp, Briefcase, UserSearch,
  Award, CheckCircle, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import StatusBadge from '../components/StatusBadge';

const STAGE_ORDER = ['New', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
const COLORS = ['#3a5bdb', '#6366f1', '#f59e0b', '#f97316', '#22c55e', '#ef4444'];

const fmt = (n: number) =>
  n >= 1_00_00_000 ? `₹${(n / 1_00_00_000).toFixed(1)}Cr`
  : n >= 1_00_000 ? `₹${(n / 1_00_000).toFixed(1)}L`
  : `₹${n.toLocaleString('en-IN')}`;

const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

const revenueData = months.map((m, i) => ({
  month: m,
  revenue: [180000, 240000, 320000, 210000, 520000, 270000][i],
  placements: [1, 2, 2, 1, 3, 2][i],
}));

export default function Dashboard() {
  const { clients, contacts, leads, jobOrders, candidates, placements, activities } = useCRM();

  const activeClients = clients.filter(c => c.status === 'Active').length;
  const openJobs = jobOrders.filter(j => j.status === 'Open' || j.status === 'In Progress').length;
  const activeCandidates = candidates.filter(c => c.status === 'Active').length;
  const totalPipelineValue = leads
    .filter(l => !['Won', 'Lost'].includes(l.stage))
    .reduce((sum, l) => sum + l.value * (l.probability / 100), 0);
  const totalFees = placements
    .filter(p => p.invoiced)
    .reduce((sum, p) => sum + p.fee, 0);
  const upcomingActivities = activities.filter(a => a.status === 'Planned').length;

  // Pipeline by stage
  const stageData = STAGE_ORDER.map(stage => ({
    stage,
    count: leads.filter(l => l.stage === stage).length,
    value: leads.filter(l => l.stage === stage).reduce((s, l) => s + l.value, 0),
  }));

  // Candidate status distribution
  const candStatusData = ['Active', 'Passive', 'Placed', 'On Hold'].map(status => ({
    name: status,
    value: candidates.filter(c => c.status === status).length,
  })).filter(d => d.value > 0);

  const recentPlacements = placements.slice(0, 5);
  const upcomingActs = activities.filter(a => a.status === 'Planned').slice(0, 5);

  const kpis = [
    { label: 'Active Clients', value: activeClients, icon: Building2, color: 'text-brand-600 bg-brand-50' },
    { label: 'Open Job Orders', value: openJobs, icon: Briefcase, color: 'text-green-600 bg-green-50' },
    { label: 'Active Candidates', value: activeCandidates, icon: UserSearch, color: 'text-purple-600 bg-purple-50' },
    { label: 'Pipeline Value', value: fmt(totalPipelineValue), icon: TrendingUp, color: 'text-orange-600 bg-orange-50' },
    { label: 'Fees Collected', value: fmt(totalFees), icon: Award, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Contacts', value: contacts.length, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Placements', value: placements.length, icon: CheckCircle, color: 'text-teal-600 bg-teal-50' },
    { label: 'Upcoming Tasks', value: upcomingActivities, icon: Clock, color: 'text-red-600 bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-xl bg-gradient-to-r from-brand-700 to-brand-500 text-white p-6">
        <h2 className="text-xl font-bold">Welcome back, Annu!</h2>
        <p className="text-brand-200 text-sm mt-1">Here's what's happening with your HR consulting practice today.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4 p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue trend */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
              <Tooltip formatter={(v) => fmt(v as number)} />
              <Line type="monotone" dataKey="revenue" stroke="#3a5bdb" strokeWidth={2} dot={{ r: 4 }} name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Candidate status */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Candidate Pool</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={candStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {candStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline by stage */}
      <div className="card">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Pipeline by Stage</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={stageData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, n) => n === 'value' ? fmt(v as number) : v} />
            <Bar dataKey="count" name="Leads" fill="#3a5bdb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Placements + Upcoming Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Placements */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Placements</h3>
          {recentPlacements.length === 0 ? (
            <p className="text-sm text-gray-400">No placements yet.</p>
          ) : (
            <div className="space-y-3">
              {recentPlacements.map(p => {
                const cand = candidates.find(c => c.id === p.candidateId);
                const client = clients.find(c => c.id === p.clientId);
                return (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {cand ? `${cand.firstName} ${cand.lastName}` : '—'}
                      </p>
                      <p className="text-xs text-gray-500">{client?.name}</p>
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

        {/* Upcoming Activities */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Upcoming Activities</h3>
          {upcomingActs.length === 0 ? (
            <p className="text-sm text-gray-400">All clear!</p>
          ) : (
            <div className="space-y-3">
              {upcomingActs.map(act => (
                <div key={act.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <span className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    act.type === 'Call' ? 'bg-green-100 text-green-700'
                    : act.type === 'Meeting' ? 'bg-blue-100 text-blue-700'
                    : act.type === 'Email' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                    {act.type[0]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{act.subject}</p>
                    <p className="text-xs text-gray-500">{act.assignedTo} · Due {act.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
