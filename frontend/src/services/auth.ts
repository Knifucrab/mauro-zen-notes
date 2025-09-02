import type { LoginCredentials, AuthResponse } from '../types/Auth';

const API_URL = 'http://localhost:3000';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

export async function setupDefaultUser(): Promise<void> {
  const response = await fetch(`${API_URL}/auth/setup-default-user`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to setup default user');
  }
}

export function getStoredToken(): string | null {
  return localStorage.getItem('authToken');
}

export function setStoredToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function removeStoredToken(): void {
  localStorage.removeItem('authToken');
}

export function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
