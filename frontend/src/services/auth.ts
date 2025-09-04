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
  const response = await fetch(`${apiUrl}/api/auth/login`, {
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



export async function createDefaultUser(): Promise<void> {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/create-default-user`, {
    method: 'POST',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create default user');
  }
}

export async function register(credentials: LoginCredentials): Promise<AuthResponse> {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }
  return response.json();
}


export interface UserProfile {
  id: number;
  username: string;
  // Add more fields as needed based on backend response
}

export async function getProfile(): Promise<UserProfile> {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
}


export async function updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(profile),
  });
  if (!response.ok) {
    throw new Error('Failed to update profile');
  }
  return response.json();
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
  if (!response.ok) {
    throw new Error('Failed to change password');
  }
}

export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }
  return response.json();
}

export async function logout(): Promise<void> {
  const apiUrl = await getApiUrl();
  const response = await fetch(`${apiUrl}/api/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to logout');
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
