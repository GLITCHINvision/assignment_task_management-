'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem('accessToken');
          if (pathname.startsWith('/dashboard')) {
            router.push('/login');
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [pathname, router]);

  const login = async (email: string, pass: string) => {
    const { data } = await api.post('/auth/login', { email, password: pass });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    router.push('/dashboard');
  };

  const register = async (email: string, pass: string, name: string) => {
    const { data } = await api.post('/auth/register', { email, password: pass, name });
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
