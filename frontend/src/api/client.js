// frontend/src/api/client.js

const API_BASE_URL = 'http://localhost:3000';

export async function saveProjectToBackend(project) {
  // project: { name, template_data, target_platform }
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

export async function exportProject(platform, projectId) {
  // platform: 'static' | 'shopify'
  const res = await fetch(`${API_BASE_URL}/api/export/${platform}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to export');
  }

  return await res.json(); // { files }
}
