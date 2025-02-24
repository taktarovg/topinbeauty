// src/components/telegram/TelegramAuth.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/providers/AuthProvider';
import { isTelegramMiniApp, getTelegramUser } from '@/lib/telegram-client';

export function TelegramAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAuthContext();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initAuth = async () => {
      try {
        if (!isTelegramMiniApp()) {
          console.log('Not in Telegram WebApp environment');
          return;
        }

        const telegramUser = getTelegramUser();
        if (!telegramUser) {
          throw new Error('No Telegram user data');
        }

        const authData = {
          id: telegramUser.telegramId,
          first_name: telegramUser.firstName,
          last_name: telegramUser.lastName || '',
          username: telegramUser.username || '',
          photo_url: telegramUser.avatar || '',
          auth_date: Math.floor(Date.now() / 1000),
          hash: '',
        };

        if (!user) {
          await login(authData);
          toast({
            title: 'Telegram Auth',
            description: `Добро пожаловать, ${telegramUser.firstName || telegramUser.username || 'User'}!`,
          });
        }

        router.push('/');
      } catch (error) {
        console.error('Telegram auth error:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось авторизоваться через Telegram',
          variant: 'destructive',
        });
      }
    };

    initAuth();
  }, [login, user, router, toast]);

  return null;
}