import { useGoogle } from '../context/GoogleContext';

export interface GCalEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end:   { dateTime?: string; date?: string };
  attendees?: { email: string; displayName?: string; responseStatus?: string }[];
  hangoutLink?: string;
  htmlLink: string;
  status: string;
  organizer?: { email: string; displayName?: string };
}

export function useGoogleCalendar() {
  const { accessToken } = useGoogle();

  async function listEvents(maxResults = 50): Promise<GCalEvent[]> {
    if (!accessToken) return [];
    const now = new Date().toISOString();
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events` +
      `?timeMin=${encodeURIComponent(now)}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message ?? 'Failed to load calendar events');
    }
    const data = await res.json();
    return (data.items ?? []) as GCalEvent[];
  }

  async function createEvent(params: {
    summary: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    attendees?: string[];
    addMeet?: boolean;
  }): Promise<GCalEvent> {
    if (!accessToken) throw new Error('Not connected to Google');
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const body: Record<string, unknown> = {
      summary: params.summary,
      description: params.description,
      start: { dateTime: params.startDateTime, timeZone: tz },
      end:   { dateTime: params.endDateTime,   timeZone: tz },
      attendees: params.attendees?.map(e => ({ email: e })),
      reminders: { useDefault: true },
    };
    if (params.addMeet) {
      body.conferenceData = {
        createRequest: {
          requestId: `crm-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }
    const qs = params.addMeet ? '?conferenceDataVersion=1' : '';
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events${qs}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message ?? 'Failed to create event');
    }
    return res.json();
  }

  async function deleteEvent(eventId: string): Promise<void> {
    if (!accessToken) return;
    await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
    );
  }

  return { listEvents, createEvent, deleteEvent };
}
