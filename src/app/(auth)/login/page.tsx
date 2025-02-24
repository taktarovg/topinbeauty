// src/app/(auth)/login/page.tsx
'use client';

import dynamic from 'next/dynamic'; // Импорт для динамического импорта
import { useAuthContext } from '@/providers/AuthProvider'; // Хук для контекста
import { useEffect, useState } from 'react'; // Хуки для управления состоянием и эффектами
import { useRouter } from 'next/navigation'; // Для навигации

// Динамически импортируем TelegramAuth с отключением SSR
const TelegramAuth = dynamic(() => import('@/components/telegram/TelegramAuth').then(mod => mod.TelegramAuth), {
  ssr: false, // Отключаем серверный рендеринг для TelegramAuth
});

export default function LoginPage() {
  const { isTelegramWebApp } = useAuthContext(); // Получаем состояние из контекста
  const [showLoading, setShowLoading] = useState(false); // Локальное состояние для отображения загрузки
  const router = useRouter();

  // Проверяем, выполняется ли код на клиенте, и инициализируем авторизацию
  useEffect(() => {
    if (typeof window !== 'undefined' && isTelegramWebApp) {
      const user = getTelegramUser(); // Импортируем и вызываем только на клиенте
      if (user) {
        router.push('/'); // Перенаправляем на главную страницу
      }
    }
  }, [isTelegramWebApp, router]);

  // Если мы в Telegram WebApp, показываем сообщение о загрузке
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            Для регистрации или авторизации войдите через Telegram
          </h1>
          <p className="mt-2 text-gray-600">
            После авторизации Вы сможете пользоваться всем функционалом
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <TelegramAuth /> {/* Используем динамически импортированный компонент */}
        </div>
      </div>
    </div>
  );
}

// Импортируем getTelegramUser только на клиенте
function getTelegramUser() {
  if (typeof window !== 'undefined') {
    return import('@/lib/telegram-client').then(mod => mod.getTelegramUser());
  }
  return null;
}