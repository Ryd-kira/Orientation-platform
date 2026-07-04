import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import client, { fetchCsrfCookie } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await client.get('/me');
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password, remember = false) => {
    await fetchCsrfCookie();
    const { data } = await client.post('/login', { email, password, remember });
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, password_confirmation) => {
    await fetchCsrfCookie();
    const { data } = await client.post('/register', { name, email, password, password_confirmation });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try {
      await client.post('/logout');
    } catch {
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
