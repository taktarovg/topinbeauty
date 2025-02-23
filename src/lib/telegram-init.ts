// src/lib/telegram-init.ts
import { init } from '@telegram-apps/sdk';
import type { TelegramWebApp } from './telegram';

// Инициализируем WebApp для глобального доступа
export const WebApp = init({});

// Экспортируем тип пользователя из TelegramWebApp
export type WebAppUser = NonNullable<TelegramWebApp['initDataUnsafe']['user']>;

// Функция для проверки окружения Telegram Mini App
export function isTelegramMiniApp(): boolean {
  return !!WebApp.initData; // Проверяем наличие initData для определения окружения Telegram
}