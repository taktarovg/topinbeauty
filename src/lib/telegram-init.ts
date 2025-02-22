// src/lib/telegram-init.ts
import { init, type WebAppUser } from '@telegram-apps/sdk';

// Инициализируем WebApp для глобального доступа
export const WebApp = init({
  debug: process.env.NODE_ENV === 'development',
});

// Экспортируем необходимые типы из @telegram-apps/sdk
export type { WebAppUser };

// Функция для проверки окружения Telegram Mini App
export function isTelegramMiniApp(): boolean {
  return !!WebApp.initData; // Проверяем наличие initData для определения окружения Telegram
}