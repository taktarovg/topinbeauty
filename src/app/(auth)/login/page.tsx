// src/app/(auth)/login/page.tsx
'use client'

import { getTelegramUser } from '@/lib/telegram-client';
import TelegramAuth from '@/components/telegram/TelegramAuth'
import { useAuthContext } from '@/providers/AuthProvider'

export default function LoginPage() {
  const { isTelegramWebApp } = useAuthContext()

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
    )
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
          <TelegramAuth />
        </div>
      </div>
    </div>
  )
}