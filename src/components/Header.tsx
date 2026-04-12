import { Menu, Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const today = new Date().toISOString().slice(0, 10);

export default function Header({ onMenuClick, title }: HeaderProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { activities } = useCRM();

  const overdueCount = activities.filter(a => a.status === 'Planned' && a.dueDate <= today).length;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center gap-4">
      <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700">
        <Menu size={22} />
      </button>

      <h2 className="text-lg font-semibold text-gray-900 flex-shrink-0 hidden sm:block">{title}</h2>

      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search clients, leads, candidates, skills..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 bg-gray-50"
          />
        </div>
      </form>

      {/* Notification bell */}
      <button
        onClick={() => navigate('/activities')}
        className="relative text-gray-500 hover:text-gray-700 ml-auto flex-shrink-0"
        title={overdueCount > 0 ? `${overdueCount} overdue task(s)` : 'Activities'}
      >
        <Bell size={20} />
        {overdueCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold px-0.5">
            {overdueCount > 9 ? '9+' : overdueCount}
          </span>
        )}
      </button>

      {/* Avatar */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
          A
        </div>
        <div className="hidden lg:block">
          <p className="text-xs font-semibold text-gray-900 leading-tight">Annu Sharma</p>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
      </div>
    </header>
  );
}
