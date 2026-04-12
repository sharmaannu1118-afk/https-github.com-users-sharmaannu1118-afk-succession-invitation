import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, TrendingUp,
  UserSearch, Briefcase, Award, CalendarCheck, X
} from 'lucide-react';

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients',     icon: Building2,       label: 'Clients' },
  { to: '/contacts',    icon: Users,           label: 'Contacts' },
  { to: '/leads',       icon: TrendingUp,      label: 'Leads & Pipeline' },
  { to: '/candidates',  icon: UserSearch,      label: 'Candidates' },
  { to: '/jobs',        icon: Briefcase,       label: 'Job Orders' },
  { to: '/placements',  icon: Award,           label: 'Placements' },
  { to: '/activities',  icon: CalendarCheck,   label: 'Activities' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-brand-900 text-white z-30
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-brand-800">
          <div>
            <p className="text-xs text-brand-300 font-medium tracking-widest uppercase">CRM</p>
            <h1 className="text-lg font-bold leading-tight text-white">Annu HR</h1>
            <p className="text-xs text-brand-400">Consulting & Advisory</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-brand-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-4 px-3">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-brand-300 hover:bg-brand-800 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-brand-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-white">Annu Sharma</p>
              <p className="text-xs text-brand-400">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
