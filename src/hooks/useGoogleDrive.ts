import { useGoogle } from '../context/GoogleContext';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: string;
  modifiedTime: string;
  createdTime: string;
}

export function useGoogleDrive() {
  const { accessToken } = useGoogle();

  async function listFiles(searchName?: string): Promise<DriveFile[]> {
    if (!accessToken) return [];
    const fields = 'files(id,name,mimeType,webViewLink,webContentLink,size,modifiedTime,createdTime)';
    const q = searchName ? `&q=${encodeURIComponent(`name contains '${searchName}'`)}` : '';
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?pageSize=40&orderBy=modifiedTime+desc&fields=${encodeURIComponent(fields)}${q}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message ?? 'Failed to list Drive files');
    }
    const data = await res.json();
    return (data.files ?? []) as DriveFile[];
  }

  async function uploadFile(file: File): Promise<DriveFile> {
    if (!accessToken) throw new Error('Not connected to Google');
    const metadata = { name: file.name, mimeType: file.type };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    const res = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,createdTime,modifiedTime`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      }
    );
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message ?? 'Upload failed');
    }
    return res.json();
  }

  async function deleteFile(fileId: string): Promise<void> {
    if (!accessToken) return;
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return { listFiles, uploadFile, deleteFile };
}
