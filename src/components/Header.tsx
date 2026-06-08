import { Menu, Bell, Search, Download, Upload } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCRM } from '../context/CRMContext';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}

const today = new Date().toISOString().slice(0, 10);

export default function Header({ onMenuClick, title }: HeaderProps) {
  const [query, setQuery]         = useState('');
  const [imported, setImported]   = useState(false);
  const fileRef                   = useRef<HTMLInputElement>(null);
  const navigate                  = useNavigate();
  const { activities, exportData, importData } = useCRM();

  const overdueCount = activities.filter(a => a.status === 'Planned' && a.dueDate <= today).length;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const json = ev.target?.result as string;
      if (window.confirm('This will replace ALL your current CRM data with the backup file. Continue?')) {
        importData(json);
        setImported(true);
        setTimeout(() => setImported(false), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center gap-3">
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
            placeholder="Search clients, leads, candidates…"
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 bg-gray-50"
          />
        </div>
      </form>

      {/* Backup & Restore */}
      <div className="flex items-center gap-1 ml-auto flex-shrink-0">
        {imported && (
          <span className="text-xs text-green-600 font-medium mr-1">Data restored!</span>
        )}

        {/* Export / Backup */}
        <button
          onClick={exportData}
          title="Backup – download all your CRM data as a file"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-300 transition-colors"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Backup</span>
        </button>

        {/* Import / Restore */}
        <button
          onClick={() => fileRef.current?.click()}
          title="Restore – load CRM data from a backup file"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-300 transition-colors"
        >
          <Upload size={14} />
          <span className="hidden sm:inline">Restore</span>
        </button>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />

        {/* Notification bell */}
        <button
          onClick={() => navigate('/activities')}
          className="relative text-gray-500 hover:text-gray-700 ml-1"
          title={overdueCount > 0 ? `${overdueCount} overdue` : 'Activities'}
        >
          <Bell size={20} />
          {overdueCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold px-0.5">
              {overdueCount > 9 ? '9+' : overdueCount}
            </span>
          )}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 ml-1">
          <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-gray-900 leading-tight">Annu Chelaramani</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
