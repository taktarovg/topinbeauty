// src/app/(auth)/login/page.tsx'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';

// Динамически импортируем TelegramAuth с отключением SSR
const TelegramAuth = dynamic(() => import('@/components/telegram/TelegramAuth').then(mod => mod.TelegramAuth), {
  ssr: false,
});

export default function LoginPage() {
  const { isTelegramWebApp, user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              Загрузка...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Перенаправление уже произошло
  }

  if (isTelegramWebApp) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              Выполняется автоматическая авторизация...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // Резервный сценарий для браузера: ручная авторизация через Telegram Web
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Авторизация через Telegram
          </h1>
          <p className="mt-2 text-gray-600">
            Откройте этот сервис в Telegram Mini App для автоматической авторизации или нажмите кнопку ниже для ручной авторизации.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.location.href = 'tg://resolve?domain=your_bot_name'}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Войти через Telegram
          </button>
        </div>
      </div>
    </div>
  );
}

// Импортируем getTelegramUser только на клиенте (оставляем для совместимости)
function getTelegramUser() {
  if (typeof window !== 'undefined') {
    return import('@/lib/telegram-client').then(mod => mod.getTelegramUser());
  }
  return null;
}