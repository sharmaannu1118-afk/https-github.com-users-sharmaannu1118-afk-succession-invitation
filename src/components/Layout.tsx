import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import QuickAdd from './QuickAdd';

const TITLES: Record<string, string> = {
  '/':            'Dashboard',
  '/clients':     'Clients',
  '/contacts':    'Contacts',
  '/leads':       'Leads & Pipeline',
  '/candidates':  'Candidates',
  '/jobs':        'Job Orders',
  '/placements':  'Placements',
  '/activities':  'Activities',
  '/reports':     'Reports & Analytics',
  '/search':      'Search Results',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? 'Annu HR CRM';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <QuickAdd />
    </div>
  );
}
