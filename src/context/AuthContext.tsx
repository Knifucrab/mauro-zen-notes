import React, { createContext, useEffect, useState } from 'react';
import type { User } from '../types/Auth';
import { getStoredToken, removeStoredToken } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored token on app start
    const storedToken = getStoredToken();
    if (storedToken) {
      setToken(storedToken);
      // In a real app, you'd validate the token with the server
      // For now, we'll assume it's valid and set a mock user
      setUser({
        id: 1,
        username: 'admin',
        createdAt: new Date().toISOString()
      });
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    removeStoredToken();
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
