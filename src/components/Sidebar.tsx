import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, TrendingUp,
  UserSearch, Briefcase, CalendarCheck, BarChart2,
  X, CheckSquare, Receipt, KeyRound,
} from 'lucide-react';

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients',     icon: Building2,       label: 'Clients' },
  { to: '/contacts',    icon: Users,           label: 'Contacts' },
  { to: '/tasks',       icon: CheckSquare,     label: 'Tasks' },
  { to: '/leads',       icon: TrendingUp,      label: 'Leads & Pipeline' },
  { to: '/candidates',  icon: UserSearch,      label: 'Candidates' },
  { to: '/jobs',        icon: Briefcase,       label: 'Job Orders' },
  { to: '/invoices',    icon: Receipt,         label: 'Invoices' },
  { to: '/activities',  icon: CalendarCheck,   label: 'Activities' },
  { to: '/credentials', icon: KeyRound,        label: 'Login Credentials' },
  { to: '/reports',     icon: BarChart2,       label: 'Reports' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-brand-900 text-white z-30
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto flex flex-col
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-brand-800">
          <div className="min-w-0">
            <h1 className="text-lg font-black leading-tight text-white tracking-widest">ANNU</h1>
            <p className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: '#c9a84c' }}>
              HR Business Partner
            </p>
          </div>
          <button onClick={onClose} className="lg:hidden text-brand-400 hover:text-white ml-1 flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-3 px-3 flex-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-brand-300 hover:bg-brand-800 hover:text-white'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer: CRM user */}
        <div className="border-t border-brand-800 px-3 pt-3 pb-4">
          <div className="flex items-center gap-3 px-2 pt-1">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Annu Chelaramani</p>
              <p className="text-xs text-brand-400">Admin · HR Business Partner</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
