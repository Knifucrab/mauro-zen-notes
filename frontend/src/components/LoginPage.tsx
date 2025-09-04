import React, { useState } from 'react';
import { login as apiLogin, createDefaultUser, setStoredToken } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import NotebookModel from './NotebookModel';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoginError, setHasLoginError] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setHasLoginError(false);
    setIsLoading(true);
    console.log('Login form submitted', { username, password });
    try {
      const response = await apiLogin({ username, password });
      console.log('Login API response:', response);
  setStoredToken(response.token);
  login(response.token, response.user);
    } catch (err) {
      setHasLoginError(true);
      setError('Username or password incorrect');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupDefaultUser = async () => {
    setError('');
    setHasLoginError(false);
    setIsLoading(true);

    try {
  await createDefaultUser();
      setError('Default user created successfully! You can now login with admin/password123');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup default user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#DDDCC8' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <NotebookModel />
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Mauro's Zen Notes</h1>
          <p className="text-lg text-gray-700">Please log in to continue</p>
        </div>

        <div className="p-6 md:p-8 border-2 border-black rounded shadow-lg" style={{ backgroundColor: '#DDDCC8' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-bold mb-2 text-black">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (hasLoginError) {
                    setHasLoginError(false);
                    setError('');
                  }
                }}
                className={`w-full px-4 py-3 ${hasLoginError ? 'border-red-500 border-2' : 'border border-black'} rounded focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg`}
                style={{ backgroundColor: '#DDDCC8' }}
                placeholder="Enter username"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-2 text-black">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (hasLoginError) {
                    setHasLoginError(false);
                    setError('');
                  }
                }}
                className={`w-full px-4 py-3 ${hasLoginError ? 'border-red-500 border-2' : 'border border-black'} rounded focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg`}
                style={{ backgroundColor: '#DDDCC8' }}
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 border border-red-500 rounded bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 border-2 border-black rounded font-bold text-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#DDDCC8', color: 'black' }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-sm text-gray-600 mb-3 text-center">
              First time setup? Create the default user:
            </p>
            <button
              onClick={handleSetupDefaultUser}
              disabled={isLoading}
              className="w-full py-2 px-4 border border-black rounded text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#E8BCA4', color: 'black' }}
            >
              Setup Default User (admin/password123)
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Default credentials: <strong>admin</strong> / <strong>password123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
