import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { GOOGLE_SCOPES, getStoredClientId, setStoredClientId } from '../config/google';

// ── GSI type declarations ────────────────────────────────────────────────────
interface TokenClient {
  requestToken: () => void;
}
interface TokenResponse {
  access_token?: string;
  error?: string;
}
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient(cfg: {
            client_id: string;
            scope: string;
            callback: (r: TokenResponse) => void;
            error_callback?: (e: { type: string }) => void;
          }): TokenClient;
          revoke(token: string, cb: () => void): void;
        };
      };
    };
  }
}

// ── Context ──────────────────────────────────────────────────────────────────
export interface GoogleUser {
  email: string;
  name: string;
  picture?: string;
}

interface GoogleCtx {
  isConnected: boolean;
  isLoading: boolean;
  user: GoogleUser | null;
  accessToken: string | null;
  needsSetup: boolean;
  connect: () => void;
  cancelConnect: () => void;
  disconnect: () => void;
  saveClientId: (id: string) => void;
}

const GoogleContext = createContext<GoogleCtx | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export function GoogleProvider({ children }: { children: React.ReactNode }) {
  const [clientId, setClientId] = useState(getStoredClientId);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const tokenClientRef = useRef<TokenClient | null>(null);
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load Google Identity Services script once
  useEffect(() => {
    if (window.google) { setGsiReady(true); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    s.onload = () => setGsiReady(true);
    document.head.appendChild(s);
  }, []);

  function clearConnectTimeout() {
    if (connectTimeoutRef.current) {
      clearTimeout(connectTimeoutRef.current);
      connectTimeoutRef.current = null;
    }
  }

  // Re-init token client whenever clientId or GSI readiness changes
  useEffect(() => {
    if (!gsiReady || !clientId || !window.google) return;
    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: GOOGLE_SCOPES,
      callback: async (res) => {
        clearConnectTimeout();
        setIsLoading(false);
        if (!res.access_token) {
          if (res.error && res.error !== 'access_denied') {
            alert(`Google sign-in failed: ${res.error}`);
          }
          return;
        }
        setAccessToken(res.access_token);
        // Fetch Google profile
        try {
          const r = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${res.access_token}` },
          });
          if (r.ok) {
            const u = await r.json();
            setUser({ email: u.email, name: u.name, picture: u.picture });
          }
        } catch { /* ignore */ }
      },
      error_callback: (e) => {
        clearConnectTimeout();
        setIsLoading(false);
        if (e.type !== 'popup_closed' && e.type !== 'popup_failed_to_open') {
          alert(`Google error: ${e.type}`);
        }
      },
    });
  }, [gsiReady, clientId]); // eslint-disable-line react-hooks/exhaustive-deps

  const connect = useCallback(() => {
    if (!tokenClientRef.current) {
      alert('Google Sign-In is still loading. Please wait a moment and try again.');
      return;
    }
    setIsLoading(true);
    // Safety: reset loading state if no response within 60 seconds (e.g. popup blocked)
    clearConnectTimeout();
    connectTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      connectTimeoutRef.current = null;
    }, 60000);
    tokenClientRef.current.requestToken();
  }, []);

  const cancelConnect = useCallback(() => {
    clearConnectTimeout();
    setIsLoading(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const disconnect = useCallback(() => {
    clearConnectTimeout();
    if (accessToken && window.google) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
    }
    setAccessToken(null);
    setUser(null);
    setIsLoading(false);
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveClientId = useCallback((id: string) => {
    setStoredClientId(id);
    setClientId(id);
  }, []);

  return (
    <GoogleContext.Provider value={{
      isConnected: !!accessToken,
      isLoading,
      user,
      accessToken,
      needsSetup: !clientId,
      connect,
      cancelConnect,
      disconnect,
      saveClientId,
    }}>
      {children}
    </GoogleContext.Provider>
  );
}

export function useGoogle() {
  const ctx = useContext(GoogleContext);
  if (!ctx) throw new Error('useGoogle must be inside GoogleProvider');
  return ctx;
}
