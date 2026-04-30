import { useState, useEffect, useCallback } from 'react';
import {
  Calendar as CalIcon, Plus, Video, ExternalLink,
  RefreshCw, Users, Trash2, Clock,
} from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { useGoogle } from '../context/GoogleContext';
import { useGoogleCalendar, type GCalEvent } from '../hooks/useGoogleCalendar';
import BookMeetingModal from '../components/BookMeetingModal';
import GoogleSetupModal from '../components/GoogleSetupModal';

// ── Helpers ──────────────────────────────────────────────────────────────────
function getEventTime(ev: GCalEvent): string {
  if (ev.start.date) return 'All day';
  if (!ev.start.dateTime) return '';
  const s = format(parseISO(ev.start.dateTime), 'h:mm a');
  const e = ev.end.dateTime ? format(parseISO(ev.end.dateTime), 'h:mm a') : '';
  return e ? `${s} – ${e}` : s;
}

function dateLabel(dateKey: string): string {
  const d = parseISO(dateKey);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEEE, MMMM d');
}

function groupByDate(events: GCalEvent[]): [string, GCalEvent[]][] {
  const map: Record<string, GCalEvent[]> = {};
  for (const ev of events) {
    const key = (ev.start.dateTime ?? ev.start.date ?? '').slice(0, 10);
    (map[key] ??= []).push(ev);
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
}

// ── Connect wall ─────────────────────────────────────────────────────────────
function ConnectWall({ onSetup }: { onSetup: () => void }) {
  const { connect, isLoading, needsSetup } = useGoogle();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
        <CalIcon size={40} className="text-blue-600" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Google Calendar</h2>
        <p className="text-gray-500 max-w-sm">
          Sign in with your Google account to view upcoming events and book meetings directly from the CRM.
        </p>
      </div>
      {needsSetup ? (
        <button onClick={onSetup} className="btn-primary">
          Setup Google Integration
        </button>
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
export default function Calendar() {
  const { isConnected, needsSetup } = useGoogle();
  const { listEvents, deleteEvent } = useGoogleCalendar();
  const [events, setEvents] = useState<GCalEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBook, setShowBook] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try { setEvents(await listEvents(60)); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Error loading events'); }
    finally { setLoading(false); }
  }, [listEvents]);

  useEffect(() => { if (isConnected) loadEvents(); }, [isConnected, loadEvents]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this event from Google Calendar?')) return;
    await deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  if (!isConnected) {
    return (
      <>
        <ConnectWall onSetup={() => setShowSetup(true)} />
        {showSetup && <GoogleSetupModal onClose={() => setShowSetup(false)} />}
      </>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = events.filter(e => (e.start.dateTime ?? e.start.date ?? '').startsWith(today)).length;
  const groups = groupByDate(events);

  return (
    <div className="space-y-4">
      {/* Stats + actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="card p-3 flex items-center gap-3 min-w-[120px]">
          <Clock size={18} className="text-blue-500" />
          <div>
            <p className="text-xl font-bold text-gray-900">{todayCount}</p>
            <p className="text-xs text-gray-500">Today</p>
          </div>
        </div>
        <div className="card p-3 flex items-center gap-3 min-w-[120px]">
          <CalIcon size={18} className="text-brand-500" />
          <div>
            <p className="text-xl font-bold text-gray-900">{events.length}</p>
            <p className="text-xs text-gray-500">Upcoming</p>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={loadEvents} disabled={loading} className="btn-secondary">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button onClick={() => setShowBook(true)} className="btn-primary">
            <Plus size={15} /> Book Meeting
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Event list */}
      {loading && events.length === 0 ? (
        <div className="card p-10 text-center text-gray-400">Loading events…</div>
      ) : groups.length === 0 ? (
        <div className="card p-10 text-center">
          <CalIcon size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No upcoming events found.</p>
          <button onClick={() => setShowBook(true)} className="btn-primary mx-auto">
            Book your first meeting
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map(([dateKey, evs]) => (
            <div key={dateKey}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-600">{dateLabel(dateKey)}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {evs.length}
                </span>
              </div>
              <div className="space-y-2">
                {evs.map(ev => (
                  <div key={ev.id}
                    className="card p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
                    {/* Time */}
                    <div className="text-xs text-gray-400 min-w-[90px] mt-0.5 whitespace-nowrap">
                      {getEventTime(ev)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{ev.summary ?? '(No title)'}</p>
                      {ev.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{ev.description}</p>
                      )}
                      {ev.attendees && ev.attendees.length > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                          <Users size={11} />
                          <span className="truncate">
                            {ev.attendees.map(a => a.displayName ?? a.email).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {ev.hangoutLink && (
                        <a href={ev.hangoutLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                          <Video size={12} /> Join
                        </a>
                      )}
                      <a href={ev.htmlLink} target="_blank" rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors" title="Open in Google Calendar">
                        <ExternalLink size={14} />
                      </a>
                      <button onClick={() => handleDelete(ev.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showBook && (
        <BookMeetingModal
          onClose={() => { setShowBook(false); loadEvents(); }}
        />
      )}
      {showSetup && !needsSetup && <GoogleSetupModal onClose={() => setShowSetup(false)} />}
    </div>
  );
}
