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
            {/* App icon — Annu HRBP logo: bold navy A + gold swoosh */}
            <div className="flex-shrink-0 w-11 h-11 rounded-xl shadow-lg overflow-hidden bg-white flex items-center justify-center">
              <svg viewBox="0 0 44 48" xmlns="http://www.w3.org/2000/svg" className="w-10 h-11">
                {/* Bold navy A — two legs meeting at apex, no crossbar */}
                <path d="M22 3 L40 44 L33 44 L22 14 L11 44 L4 44 Z" fill="#1e3a8a"/>
                {/* Gold swoosh cutting through the A — from left outer to right outer */}
                <path d="M5 31 Q14 21 22 24 Q30 27 39 21" stroke="#C9A227" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
                {/* ANNU text below */}
                <text x="22" y="50" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="9" fill="#1e3a8a" textAnchor="middle" letterSpacing="2">ANNU</text>
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold leading-tight text-white">Annu</h1>
              <p className="text-[9px] text-amber-400 font-semibold tracking-wider uppercase leading-tight">HR Business</p>
              <p className="text-[9px] text-amber-400 font-semibold tracking-wider uppercase leading-tight">Partner</p>
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
              <p className="text-xs text-brand-400">Admin · HR Business Partner</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
