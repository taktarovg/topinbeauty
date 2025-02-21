// src/components/telegram/TelegramAuth.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/providers/AuthProvider'
import { useSDK } from '@telegram-apps/sdk-react'

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    }
  }
}

export default function TelegramAuth() {
  const router = useRouter()
  const { login } = useAuthContext()
  const containerRef = useRef<HTMLDivElement>(null)
  const sdk = useSDK()

  useEffect(() => {
    // Если мы в Telegram WebApp, не показываем виджет
    if (sdk) {
      return;
    }

    if (!containerRef.current) return;

    // Очищаем контейнер
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-lang', 'ru');

    // Создаем функцию обратного вызова
    window.TelegramLoginWidget = {
      dataOnauth: async (user) => {
        try {
          await login(user);
          router.push('/profile');
        } catch (error) {
          console.error('Auth error:', error);
        }
      }
    };

    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [login, router, sdk]);

  // Если мы в Telegram WebApp, не показываем компонент
  if (sdk) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={containerRef} className="telegram-login-widget" />
    </div>
  );
}