import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, TrendingUp,
  UserSearch, Briefcase, Award, CalendarCheck, BarChart2, X, CheckSquare
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
  { to: '/tasks',       icon: CheckSquare,     label: 'Tasks' },
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
          <div className="flex items-center gap-3 min-w-0">
            {/* App icon */}
            <div className="flex-shrink-0 w-11 h-11 rounded-xl shadow-lg overflow-hidden" style={{background:'linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%)'}}>
              <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="11" cy="13" r="5" fill="white" opacity="0.7"/>
                <path d="M3 28 Q3 21 11 21 Q19 21 19 28" fill="white" opacity="0.7"/>
                <circle cx="33" cy="13" r="5" fill="white" opacity="0.7"/>
                <path d="M25 28 Q25 21 33 21 Q41 21 41 28" fill="white" opacity="0.7"/>
                <circle cx="22" cy="12" r="6" fill="white"/>
                <path d="M12 29 Q12 23 22 23 Q32 23 32 29" fill="white"/>
                <text x="22" y="40" fontFamily="Georgia,serif" fontWeight="700" fontSize="9" fill="white" textAnchor="middle" letterSpacing="1.5">AHR</text>
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight text-white">Annu HR</h1>
              <p className="text-[10px] text-brand-400 font-semibold tracking-widest uppercase">Consulting & Advisory</p>
            </div>
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

        {/* Footer */}
        <div className="px-5 py-4 border-t border-brand-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Annu Sharma</p>
              <p className="text-xs text-brand-400">Admin · annuhrconsulting.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
