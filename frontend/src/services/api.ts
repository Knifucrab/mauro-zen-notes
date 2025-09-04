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
  const response = await res.json();
  // Map backend fields to frontend fields
  return (response.data || []).map((note: any) => ({
    id: note.id,
    title: note.title,
    description: note.content, // map content to description
    creationDate: note.createdAt, // map createdAt to creationDate
    archived: note.archived || false, // now backend supports archive
    expanded: false,
    tags: note.tags || [] // now backend supports tags
  }));
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
  const res = await fetch(`${apiUrl}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ title, content: description })
  });
  return res.json();
}



export async function updateNote(id: number, title: string, description: string) {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ title, content: description })
  });
  return res.json();
}


// Fix addTagToNote to match new backend route
export async function addTagToNote(noteId: number, tagId: number) {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/notes/${noteId}/tags/${tagId}`, {
    method: 'POST',
    headers: getAuthHeaders()
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


// TAG MANAGEMENT

// Get all tags (public)
export async function getTags() {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/tags`);
  return res.json();
}

// Create a tag (protected)
export async function createTag(name: string, color: string) {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ name, color })
  });
  return res.json();
}

// NOTE ARCHIVING

// Archive a note (protected)
export async function archiveNote(noteId: number) {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/notes/${noteId}/archive`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  return res.json();
}

// Unarchive a note (protected)
export async function unarchiveNote(noteId: number) {
  const apiUrl = await getApiUrl();
  const res = await fetch(`${apiUrl}/api/notes/${noteId}/unarchive`, {
    method: 'POST',
    headers: getAuthHeaders()
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
