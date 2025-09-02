// Note API service
import type { Tag } from '../types/Tag';
import { getAuthHeaders } from './auth';

const API_URL = 'http://localhost:3000';

export async function getNotes() {
  const res = await fetch(`${API_URL}/notes`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function getNote(id: number) {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function createNote(title: string, description: string, tags: Tag[] = []) {
  const tagIds = tags.map(tag => tag.id);
  const res = await fetch(`${API_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ title, description, tagIds })
  });
  return res.json();
}

export async function updateNote(id: number, title: string, description: string) {
  // First update the note content
  const res = await fetch(`${API_URL}/notes/${id}`, {
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
  const res = await fetch(`${API_URL}/notes/${noteId}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ tagId })
  });
  return res.json();
}

export async function removeTagFromNote(noteId: number, tagId: number) {
  const res = await fetch(`${API_URL}/notes/${noteId}/tags/${tagId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return res.json();
}

// Tag management functions
export async function getTags() {
  const res = await fetch(`${API_URL}/tags`, {
    headers: getAuthHeaders()
  });
  return res.json();
}

export async function createTag(name: string, color: string) {
  const res = await fetch(`${API_URL}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ name, color })
  });
  return res.json();
}

export async function deleteNote(id: number) {
  await fetch(`${API_URL}/notes/${id}`, { 
    method: 'DELETE',
    headers: getAuthHeaders()
  });
}

export async function archiveNote(id: number) {
  await fetch(`${API_URL}/notes/${id}/archive`, { 
    method: 'POST',
    headers: getAuthHeaders()
  });
}

export async function unarchiveNote(id: number) {
  await fetch(`${API_URL}/notes/${id}/unarchive`, { 
    method: 'POST',
    headers: getAuthHeaders()
  });
}
