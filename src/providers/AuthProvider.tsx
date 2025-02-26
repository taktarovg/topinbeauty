//   src/providers/AuthProvider.tsx


'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import type { User } from '@prisma/client';
import { isTelegramMiniApp } from '@/lib/telegram-client';

// Определяем тип для initialSession, чтобы улучшить типизацию
interface InitialSession {
  user?: User;
  sessionToken?: string;
}

interface AuthContextType {
  user: User | null;
  login: (telegramData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isTelegramWebApp: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialSession }: { children: ReactNode; initialSession?: InitialSession }) {
  const [user, setUser] = useState<User | null>(initialSession?.user || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false); // Состояние для клиентской проверки
  const router = useRouter();
  const { toast } = useToast();

  // Проверка, что код выполняется на клиенте, перед использованием isTelegramMiniApp
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTelegramWebApp(isTelegramMiniApp()); // Проверяем только на клиенте
    }
  }, []);

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
      if (typeof window !== 'undefined') {
        localStorage.setItem('sessionToken', sessionToken); // Используем localStorage только на клиенте
      }
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
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sessionToken'); // Используем localStorage только на клиенте
      }
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Обновляем useEffect для проверки сессии, избегая серверных ошибок
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false); // На сервере сразу завершаем загрузку
      return;
    }

    const checkSession = async () => {
      if (initialSession?.user) {
        setUser(initialSession.user);
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('sessionToken');
      if (token) {
        try {
          const response = await fetch('/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('sessionToken');
          }
        } catch (err) {
          localStorage.removeItem('sessionToken');
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, [initialSession]);

  const value = { 
    user, 
    login, 
    logout, 
    isLoading, 
    error, 
    isTelegramWebApp,
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