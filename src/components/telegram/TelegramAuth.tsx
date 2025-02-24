// src/components/telegram/TelegramAuth.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAuthContext } from '@/providers/AuthProvider';
import { isTelegramMiniApp, getTelegramUser } from '@/lib/telegram-client'; // Обновлённый импорт вместо WebApp

export default function TelegramAuth() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAuthContext();

  useEffect(() => {
    if (typeof window === 'undefined') return; // Проверяем, что код выполняется на клиенте

    const initAuth = async () => {
      try {
        // Проверяем, запущено ли приложение в Telegram
        if (!isTelegramMiniApp()) {
          console.log('Not in Telegram WebApp environment');
          return;
        }

        const telegramUser = getTelegramUser();
        if (!telegramUser) {
          throw new Error('No Telegram user data');
        }

        // Подготавливаем данные для авторизации
        const authData = {
          id: telegramUser.telegramId, // Предполагаемый ключ, уточните в telegram-client.ts
          first_name: telegramUser.firstName, // Предполагаемые ключи, уточните в telegram-client.ts
          last_name: telegramUser.lastName || '',
          username: telegramUser.username || '',
          photo_url: telegramUser.avatar || '', // Предполагаемый ключ, уточните в telegram-client.ts
          auth_date: Math.floor(Date.now() / 1000),
          hash: '', // Убедитесь, что hash обрабатывается корректно через telegram-client.ts
        };

        // Если пользователь еще не авторизован, выполняем login
        if (!user) {
          await login(authData);
          toast({
            title: 'Telegram Auth',
            description: `Добро пожаловать, ${telegramUser.firstName || telegramUser.username || 'User'}!`,
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