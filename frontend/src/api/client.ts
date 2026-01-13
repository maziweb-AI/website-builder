// frontend/src/api/client.ts
const API_BASE_URL = 'http://localhost:3000';

export async function saveProjectToBackend(project: any) {
  const res = await fetch(`${API_BASE_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save project');
  }

  return await res.json();
}

export async function exportProject(platform: 'static' | 'shopify', projectId: number) {
  const res = await fetch(`${API_BASE_URL}/api/export/${platform}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to export');
  }

  return await res.json();
}
