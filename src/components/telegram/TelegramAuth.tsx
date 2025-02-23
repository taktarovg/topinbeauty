// src/components/telegram/TelegramAuth.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/providers/AuthProvider';
import { WebApp } from '@/lib/telegram-sdk'; // Обновлённый импорт

export default function TelegramAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAuthContext();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Проверяем, запущено ли приложение в Telegram
        if (!WebApp.initData) {
          console.log('Not in Telegram WebApp environment');
          return;
        }

        const telegramUser = WebApp.initDataUnsafe.user;
        if (!telegramUser) {
          throw new Error('No Telegram user data');
        }

        // Подготавливаем данные для авторизации
        const authData = {
          id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || '',
          username: telegramUser.username || '',
          photo_url: telegramUser.photo_url || '',
          auth_date: Math.floor(Date.now() / 1000),
          hash: WebApp.initData,
        };

        // Если пользователь еще не авторизован, выполняем login
        if (!user) {
          await login(authData);
          toast({
            title: 'Telegram Auth',
            description: `Добро пожаловать, ${telegramUser.first_name || telegramUser.username || 'User'}!`,
          });
        }

        // Перенаправляем на главную страницу
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