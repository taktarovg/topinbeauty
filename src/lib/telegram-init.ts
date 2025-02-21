// src/lib/telegram-init.ts
import { init } from '@telegram-apps/sdk';

// Инициализация WebApp
export const WebApp = init({
  debug: process.env.NODE_ENV === 'development',
});

// Удалите некорректные реэкспорты
// export { TelegramProvider, useTelegramUser, useTelegramWebApp } from '@telegram-apps/sdk-react';
export type { WebAppUser } from '@telegram-apps/sdk';