// src/components/telegram/TelegramAutoAuth.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useAuthContext } from '@/providers/AuthProvider'
import { useTelegramWebApp, useTelegramUser } from '@/lib/telegram-init'

export default function TelegramAutoAuth() {
  const router = useRouter()
  const { login } = useAuthContext()
  const { toast } = useToast()
  const webApp = useTelegramWebApp()
  const user = useTelegramUser()

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Проверяем, запущено ли приложение в Telegram
        if (!webApp || !user) {
          console.log('Not in Telegram WebApp environment');
          return;
        }

        // Подготавливаем данные для авторизации
        const authData = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || '',
          username: user.username || '',
          photo_url: user.photo_url,
          auth_date: Math.floor(Date.now() / 1000),
          hash: webApp.initData
        };

        // Авторизуем пользователя
        await login(authData);

        // Показываем уведомление об успешной авторизации
        toast({
          title: 'Успешно',
          description: 'Вы авторизованы в системе'
        });

        // Редиректим на главную
        router.push('/');
      } catch (error) {
        console.error('Telegram auto auth error:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось выполнить автоматический вход',
          variant: 'destructive'
        });
      }
    };

    initAuth();
  }, [webApp, user, login, router, toast]);

  return null;
}