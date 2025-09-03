// Note API service
import type { Tag } from '../types/Tag';
import { getAuthHeaders } from './auth';

const PROD_API_URL = 'https://mauro-zen-notes-backend.vercel.app';
const LOCAL_API_URL = 'http://localhost:3000';

async function checkApi(url: string): Promise<boolean> {
  try {
    const res = await fetch(url + '/health', { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

let API_URL: string | undefined;

export async function getApiUrl(): Promise<string> {
  if (API_URL) return API_URL;
  if (await checkApi(PROD_API_URL)) {
    API_URL = PROD_API_URL;
  } else {
    API_URL = LOCAL_API_URL;
  }
  return API_URL;
}


export async function getNotes() {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/notes`, {
    headers: getAuthHeaders()
  });
  return res.json();
}


export async function getNote(id: number) {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/notes/${id}`, {
    headers: getAuthHeaders()
  });
  return res.json();
}


export async function createNote(title: string, description: string, tags: Tag[] = []) {
  const apiUrl = await getApiUrl();
  const tagIds = tags.map(tag => tag.id);
  const res = await fetch(`${apiUrl}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ title, description, tagIds })
  });
  return res.json();
}


export async function updateNote(id: number, title: string, description: string) {
  const apiUrl = await getApiUrl();
  // First update the note content
  const res = await fetch(`${apiUrl}/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ title, description })
  });
  // Then handle tag updates - this is a simplified approach
  // In a real app, you'd want to calculate which tags to add/remove
  // For now, we'll just return the response and handle tags separately if needed
  return res.json();
}


export async function addTagToNote(noteId: number, tagId: number) {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/notes/${noteId}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ tagId })
  });
  return res.json();
}


export async function removeTagFromNote(noteId: number, tagId: number) {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/notes/${noteId}/tags/${tagId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return res.json();
}

// Tag management functions

export async function getTags() {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/tags`, {
    headers: getAuthHeaders()
  });
  return res.json();
}


export async function createTag(name: string, color: string) {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ name, color })
  });
  return res.json();
}


export async function deleteNote(id: number) {
  const apiUrl = await getApiUrl();
  await fetch(`${apiUrl}/api/notes/${id}`, { 
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}


export async function archiveNote(id: number) {
  const apiUrl = await getApiUrl();
  await fetch(`${apiUrl}/api/notes/${id}/archive`, { 
    method: 'POST',
    headers: getAuthHeaders()
  });
}


export async function unarchiveNote(id: number) {
  const apiUrl = await getApiUrl();
  await fetch(`${apiUrl}/api/notes/${id}/unarchive`, { 
    method: 'POST',
    headers: getAuthHeaders()
  });
}
