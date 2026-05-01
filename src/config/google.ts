export const GOOGLE_SCOPES = [
  'openid',
  'profile',
  'email',
  'https://www.googleapis.com/auth/gmail.send',
].join(' ');

export function getStoredClientId(): string {
  return (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ??
    localStorage.getItem('google_client_id') ?? '';
}

export function setStoredClientId(id: string) {
  localStorage.setItem('google_client_id', id.trim());
}
