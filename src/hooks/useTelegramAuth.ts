// src/hooks/useTelegramAuth.ts
'use client';

import { useEffect } from 'react';
import { WebApp } from '@/lib/telegram'; // Импорт из существующего модуля
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

export function useTelegramAuth() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const initTelegram = async () => {
      // Проверяем, инициализирован ли WebApp
      if (!WebApp.initData) return; // Заменяем isInitialized на проверку initData

      try {
        const user = WebApp.initDataUnsafe?.user;
        if (!user) return;

        // Автоматическая настройка темы и основного цвета
        WebApp.setHeaderColor('#000000');
        WebApp.setBackgroundColor('#FFFFFF');

        // Расширяем видимую область
        WebApp.expand();
      } catch (error) {
        console.error('Telegram init error:', error);
        toast({
          title: 'Ошибка инициализации',
          description: 'Не удалось инициализировать Telegram Mini App',
          variant: 'destructive',
        });
      }
    };

    initTelegram();
  }, [router, toast]);
}