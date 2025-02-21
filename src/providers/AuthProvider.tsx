// src/providers/AuthProvider.tsx
'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@prisma/client';
import { isTelegramMiniApp } from '@/lib/telegram'; // Импорт функции

interface AuthContextType {
  user: User | null;
  login: (telegramData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isTelegramWebApp: boolean; // Добавляем новое свойство
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const login = async (telegramData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Mini-App': 'true',
        },
        body: JSON.stringify(telegramData),
      });
      if (!response.ok) throw new Error('Failed to authenticate');
      const { user: newUser, sessionToken } = await response.json();
      setUser(newUser);
      localStorage.setItem('sessionToken', sessionToken);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      localStorage.removeItem('sessionToken');
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('sessionToken');
      if (token) {
        try {
          const response = await fetch('/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          }
        } catch (err) {
          localStorage.removeItem('sessionToken');
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const value = { 
    user, 
    login, 
    logout, 
    isLoading, 
    error, 
    isTelegramWebApp: isTelegramMiniApp(), // Добавляем значение
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}