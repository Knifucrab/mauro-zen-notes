import type { LoginCredentials, AuthResponse } from '../types/Auth';

const PROD_API_URL = 'https://mauro-zen-notes-backend.vercel.app';
const LOCAL_API_URL = 'http://localhost:3000';

let API_URL: string | undefined;

async function checkApi(url: string): Promise<boolean> {
  try {
    const res = await fetch(url + '/health', { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getApiUrl(): Promise<string> {
  if (API_URL) return API_URL;
  if (await checkApi(PROD_API_URL)) {
    API_URL = PROD_API_URL;
  } else {
    API_URL = LOCAL_API_URL;
  }
  return API_URL;
}


export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/auth/login`, {
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
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/auth/setup-default-user`, {
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
