import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';
import { Building2, Users, TrendingUp, UserSearch, Briefcase, CalendarCheck } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').toLowerCase().trim();
  const navigate = useNavigate();
  const { clients, contacts, leads, candidates, jobOrders, activities } = useCRM();

  if (!q) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-lg">Enter a search query in the search bar above.</p>
    </div>
  );

  const matchClients    = clients.filter(c =>
    c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) ||
    c.industry.toLowerCase().includes(q));
  const matchContacts   = contacts.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  const matchLeads      = leads.filter(l =>
    l.title.toLowerCase().includes(q) || l.stage.toLowerCase().includes(q));
  const matchCandidates = candidates.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
    c.currentTitle.toLowerCase().includes(q) ||
    c.skills.some(s => s.toLowerCase().includes(q)));
  const matchJobs       = jobOrders.filter(j =>
    j.title.toLowerCase().includes(q) ||
    j.skills.some(s => s.toLowerCase().includes(q)));
  const matchActivities = activities.filter(a =>
    a.subject.toLowerCase().includes(q) || a.relatedName.toLowerCase().includes(q));

  const total = matchClients.length + matchContacts.length + matchLeads.length +
    matchCandidates.length + matchJobs.length + matchActivities.length;

  function Section({ title, icon: Icon, count, children }: {
    title: string; icon: React.ElementType; count: number; children: React.ReactNode;
  }) {
    if (count === 0) return null;
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={16} className="text-brand-600" />
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          <span className="ml-1 badge bg-brand-100 text-brand-700">{count}</span>
        </div>
        <div className="divide-y divide-gray-50">{children}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-500">
          {total === 0
            ? `No results for "${q}"`
            : `${total} result${total > 1 ? 's' : ''} for "${q}"`}
        </p>
      </div>

      {total === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg mb-1">No results found</p>
          <p className="text-gray-400 text-sm">Try searching by name, company, skill, or status.</p>
        </div>
      )}

      <Section title="Clients" icon={Building2} count={matchClients.length}>
        {matchClients.map(c => (
          <div key={c.id} onClick={() => navigate('/clients')}
            className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-1 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                {c.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.industry} · {c.city}</p>
              </div>
            </div>
            <StatusBadge value={c.status} />
          </div>
        ))}
      </Section>

      <Section title="Contacts" icon={Users} count={matchContacts.length}>
        {matchContacts.map(c => {
          const client = clients.find(cl => cl.id === c.clientId);
          return (
            <div key={c.id} onClick={() => navigate('/contacts')}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-1 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                  {c.firstName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-gray-500">{c.role} · {client?.name}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{c.email}</p>
            </div>
          );
        })}
      </Section>

      <Section title="Leads" icon={TrendingUp} count={matchLeads.length}>
        {matchLeads.map(l => {
          const client = clients.find(c => c.id === l.clientId);
          return (
            <div key={l.id} onClick={() => navigate('/leads')}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-1 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{l.title}</p>
                <p className="text-xs text-gray-500">{client?.name} · {l.assignedTo}</p>
              </div>
              <div className="text-right">
                <StatusBadge value={l.stage} />
                <p className="text-xs text-gray-500 mt-0.5">₹{(l.value/100000).toFixed(1)}L</p>
              </div>
            </div>
          );
        })}
      </Section>

      <Section title="Candidates" icon={UserSearch} count={matchCandidates.length}>
        {matchCandidates.map(c => (
          <div key={c.id} onClick={() => navigate('/candidates')}
            className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-1 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                {c.firstName[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                <p className="text-xs text-gray-500">{c.currentTitle} · {c.location}</p>
              </div>
            </div>
            <div className="text-right">
              <StatusBadge value={c.status} />
              <div className="flex flex-wrap gap-1 mt-1 justify-end">
                {c.skills.slice(0,2).map(s => (
                  <span key={s} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{s}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Job Orders" icon={Briefcase} count={matchJobs.length}>
        {matchJobs.map(j => {
          const client = clients.find(c => c.id === j.clientId);
          return (
            <div key={j.id} onClick={() => navigate('/jobs')}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-1 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{j.title}</p>
                <p className="text-xs text-gray-500">{client?.name} · {j.location}</p>
              </div>
              <StatusBadge value={j.status} />
            </div>
          );
        })}
      </Section>

      <Section title="Activities" icon={CalendarCheck} count={matchActivities.length}>
        {matchActivities.map(a => (
          <div key={a.id} onClick={() => navigate('/activities')}
            className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-1 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">{a.subject}</p>
              <p className="text-xs text-gray-500">{a.type} · {a.relatedName} · {a.dueDate}</p>
            </div>
            <StatusBadge value={a.status} />
          </div>
        ))}
      </Section>
    </div>
  );
}
