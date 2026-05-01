import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, TrendingUp,
  UserSearch, Briefcase, Award, CalendarCheck, BarChart2,
  X, CheckSquare, Calendar, HardDrive, LogOut,
} from 'lucide-react';
import { useGoogle } from '../context/GoogleContext';
import GoogleSetupModal from './GoogleSetupModal';

const NAV = [
  { to: '/',            icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients',     icon: Building2,       label: 'Clients' },
  { to: '/contacts',    icon: Users,           label: 'Contacts' },
  { to: '/tasks',       icon: CheckSquare,     label: 'Tasks' },
  { to: '/leads',       icon: TrendingUp,      label: 'Leads & Pipeline' },
  { to: '/candidates',  icon: UserSearch,      label: 'Candidates' },
  { to: '/jobs',        icon: Briefcase,       label: 'Job Orders' },
  { to: '/placements',  icon: Award,           label: 'Placements' },
  { to: '/activities',  icon: CalendarCheck,   label: 'Activities' },
  { to: '/calendar',    icon: Calendar,        label: 'Google Calendar' },
  { to: '/drive',       icon: HardDrive,       label: 'Google Drive' },
  { to: '/reports',     icon: BarChart2,       label: 'Reports' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { isConnected, connect, cancelConnect, disconnect, isLoading, needsSetup, user } = useGoogle();
  const [showSetup, setShowSetup] = useState(false);

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
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight text-white">Annu</h1>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">HR Business Partner</p>
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

        {/* Footer: Google connect + user info */}
        <div className="border-t border-brand-800 px-3 pt-3 pb-4 space-y-2">
          {/* Google account status */}
          {isConnected && user ? (
            <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-brand-800">
              {user.picture ? (
                <img src={user.picture} className="w-7 h-7 rounded-full flex-shrink-0" alt="" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  G
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <p className="text-[10px] text-brand-400 truncate">{user.email}</p>
              </div>
              <button onClick={disconnect} title="Disconnect Google"
                className="text-brand-400 hover:text-white transition-colors flex-shrink-0">
                <LogOut size={14} />
              </button>
            </div>
          ) : needsSetup ? (
            <button
              onClick={() => setShowSetup(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-amber-300 hover:bg-brand-800 hover:text-white transition-colors border border-amber-600/40"
            >
              <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5" alt="" />
              Setup Google (Calendar · Gmail · Drive)
            </button>
          ) : (
            <button
              onClick={isLoading ? cancelConnect : connect}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-brand-300 hover:bg-brand-800 hover:text-white transition-colors border border-brand-700"
            >
              {isLoading ? (
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5" alt="" />
              )}
              {isLoading ? 'Connecting… (tap to cancel)' : 'Connect Google Account'}
            </button>
          )}

          {/* Static CRM user */}
          <div className="flex items-center gap-3 px-2 pt-1">
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

      {showSetup && <GoogleSetupModal onClose={() => setShowSetup(false)} />}
    </>
  );
}
