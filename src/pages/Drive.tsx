import { useState, useEffect, useCallback, useRef } from 'react';
import {
  HardDrive, Upload, ExternalLink, Trash2, RefreshCw,
  File, Image, FileText, Search,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useGoogle } from '../context/GoogleContext';
import { useGoogleDrive, type DriveFile } from '../hooks/useGoogleDrive';
import GoogleSetupModal from '../components/GoogleSetupModal';

// ── Helpers ──────────────────────────────────────────────────────────────────
function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith('image/'))
    return <Image size={18} className="text-teal-600 flex-shrink-0" />;
  if (mimeType.includes('pdf'))
    return <FileText size={18} className="text-red-500 flex-shrink-0" />;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel'))
    return <FileText size={18} className="text-green-600 flex-shrink-0" />;
  if (mimeType.includes('document') || mimeType.includes('word'))
    return <FileText size={18} className="text-blue-600 flex-shrink-0" />;
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
    return <FileText size={18} className="text-orange-500 flex-shrink-0" />;
  return <File size={18} className="text-gray-400 flex-shrink-0" />;
}

function formatSize(bytes?: string): string {
  if (!bytes) return '—';
  const n = parseInt(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function shortType(mimeType: string): string {
  if (mimeType.includes('google-apps.document')) return 'Google Doc';
  if (mimeType.includes('google-apps.spreadsheet')) return 'Google Sheet';
  if (mimeType.includes('google-apps.presentation')) return 'Google Slides';
  if (mimeType.includes('google-apps.folder')) return 'Folder';
  if (mimeType.includes('pdf')) return 'PDF';
  const ext = mimeType.split('/').pop() ?? mimeType;
  return ext.length > 12 ? ext.slice(0, 12) + '…' : ext;
}

// ── Connect wall ─────────────────────────────────────────────────────────────
function ConnectWall({ onSetup }: { onSetup: () => void }) {
  const { connect, isLoading, needsSetup } = useGoogle();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
        <HardDrive size={40} className="text-yellow-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Google Drive</h2>
        <p className="text-gray-500 max-w-sm">
          Sign in with Google to browse your Drive files and upload documents (resumes, contracts, reports) directly from the CRM.
        </p>
      </div>
      {needsSetup ? (
        <button onClick={onSetup} className="btn-primary">Setup Google Integration</button>
      ) : (
        <button onClick={connect} disabled={isLoading} className="btn-primary gap-2">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
          {isLoading ? 'Connecting…' : 'Connect with Google'}
        </button>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Drive() {
  const { isConnected, needsSetup } = useGoogle();
  const { listFiles, uploadFile, deleteFile } = useGoogleDrive();
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async (q?: string) => {
    setLoading(true);
    setError('');
    try { setFiles(await listFiles(q)); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error loading files'); }
    finally { setLoading(false); }
  }, [listFiles]);

  useEffect(() => { if (isConnected) loadFiles(); }, [isConnected, loadFiles]);

  function handleSearchKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') loadFiles(search || undefined);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = await uploadFile(file);
      setFiles(prev => [uploaded, ...prev]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}" from Google Drive?`)) return;
    await deleteFile(id);
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  if (!isConnected) {
    return (
      <>
        <ConnectWall onSetup={() => setShowSetup(true)} />
        {showSetup && <GoogleSetupModal onClose={() => setShowSetup(false)} />}
      </>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search files…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
          />
        </div>
        <span className="text-xs text-gray-400">{files.length} file{files.length !== 1 ? 's' : ''}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => loadFiles(search || undefined)} disabled={loading} className="btn-secondary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary">
            <Upload size={15} />
            {uploading ? 'Uploading…' : 'Upload File'}
          </button>
          <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading && files.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">Loading files…</div>
      ) : files.length === 0 ? (
        <div className="card p-10 text-center">
          <HardDrive size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No files found.</p>
          <button onClick={() => fileRef.current?.click()} className="btn-primary mx-auto">
            <Upload size={15} /> Upload First File
          </button>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="th">File Name</th>
                  <th className="th">Type</th>
                  <th className="th">Size</th>
                  <th className="th">Last Modified</th>
                  <th className="th"></th>
                </tr>
              </thead>
              <tbody>
                {files.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="td">
                      <div className="flex items-center gap-2.5 max-w-xs">
                        <FileIcon mimeType={f.mimeType} />
                        <span className="font-medium text-gray-900 text-sm truncate">{f.name}</span>
                      </div>
                    </td>
                    <td className="td text-gray-500 text-xs">{shortType(f.mimeType)}</td>
                    <td className="td text-gray-500 text-xs">{formatSize(f.size)}</td>
                    <td className="td text-gray-500 text-xs">
                      {f.modifiedTime ? format(parseISO(f.modifiedTime), 'dd MMM yyyy') : '—'}
                    </td>
                    <td className="td">
                      <div className="flex gap-2">
                        {f.webViewLink && (
                          <a href={f.webViewLink} target="_blank" rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors" title="Open in Drive">
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button onClick={() => handleDelete(f.id, f.name)}
                          className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
