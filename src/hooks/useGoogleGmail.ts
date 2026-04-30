import { useGoogle } from '../context/GoogleContext';

function makeRaw(to: string, cc: string | undefined, subject: string, body: string): string {
  const lines = [
    `To: ${to}`,
    ...(cc ? [`Cc: ${cc}`] : []),
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join('\r\n');
  // Encode bytes individually to handle UTF-8 properly
  const bytes = new TextEncoder().encode(lines);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function useGoogleGmail() {
  const { accessToken } = useGoogle();

  async function sendEmail(params: {
    to: string;
    cc?: string;
    subject: string;
    body: string;
  }): Promise<void> {
    if (!accessToken) throw new Error('Not connected to Google');
    const raw = makeRaw(params.to, params.cc, params.subject, params.body);
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message ?? 'Failed to send email');
    }
  }

  return { sendEmail };
}
