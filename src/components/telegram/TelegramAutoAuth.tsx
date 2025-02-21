// src/components/telegram/TelegramAutoAuth.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/providers/AuthProvider';
import { WebApp } from '@/lib/telegram';

export default function TelegramAutoAuth() {
  const router = useRouter();
  const { login, user } = useAuthContext();
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (!WebApp.initData) {
          console.log('Not in Telegram WebApp environment');
          return;
        }

        const telegramUser = WebApp.initDataUnsafe.user;
        if (!telegramUser) throw new Error('No Telegram user data');

        const authData = {
          id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || '',
          username: telegramUser.username || '',
          photo_url: telegramUser.photo_url || '',
          auth_date: Math.floor(Date.now() / 1000),
          hash: WebApp.initData,
        };

        if (!user) {
          await login(authData);
          toast({
            title: 'Добро пожаловать!',
            description: 'Вы успешно авторизованы',
          });
        }

        router.replace('/');
      } catch (error) {
        console.error('Telegram auto auth error:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось выполнить вход',
          variant: 'destructive',
        });
      }
    };

    initAuth();
  }, [login, user, router, toast]);

  return null;
}