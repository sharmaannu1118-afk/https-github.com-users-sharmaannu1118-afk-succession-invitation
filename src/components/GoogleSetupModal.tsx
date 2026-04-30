import { useState } from 'react';
import Modal from './Modal';
import { useGoogle } from '../context/GoogleContext';

interface Props { onClose: () => void; }

export default function GoogleSetupModal({ onClose }: Props) {
  const { saveClientId } = useGoogle();
  const [clientId, setClientId] = useState('');

  function handleSave() {
    const id = clientId.trim();
    if (!id) return;
    saveClientId(id);
    onClose();
  }

  const origin = window.location.origin;

  return (
    <Modal title="Setup Google Integration" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900 space-y-3">
          <p className="font-semibold">Follow these steps to get your Google OAuth Client ID:</p>
          <ol className="list-decimal ml-4 space-y-1.5 text-blue-800">
            <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Cloud Console → Credentials</a></li>
            <li>Create a project (e.g. <em>Annu HR CRM</em>), then enable these APIs:
              <ul className="list-disc ml-4 mt-1 space-y-0.5">
                <li>Google Calendar API</li>
                <li>Gmail API</li>
                <li>Google Drive API</li>
              </ul>
            </li>
            <li>Click <strong>Create Credentials → OAuth 2.0 Client ID</strong></li>
            <li>Application type: <strong>Web application</strong></li>
            <li>Under <strong>Authorized JavaScript origins</strong>, add:
              <code className="block mt-1 bg-blue-100 px-2 py-1 rounded font-mono text-xs break-all">{origin}</code>
            </li>
            <li>Copy the <strong>Client ID</strong> and paste it below</li>
          </ol>
        </div>

        <div>
          <label className="label">Google OAuth 2.0 Client ID</label>
          <input
            className="input font-mono text-xs"
            placeholder="123456789-xxxxxxxx.apps.googleusercontent.com"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={!clientId.trim()} className="btn-primary">
            Save & Connect
          </button>
        </div>
      </div>
    </Modal>
  );
}
