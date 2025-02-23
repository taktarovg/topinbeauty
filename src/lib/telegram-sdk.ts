// src/lib/telegram-sdk.ts
import { init } from '@telegram-apps/sdk';
import type { TelegramWebApp } from './telegram';

// Инициализируем SDK с явной типизацией
export const WebApp: TelegramWebApp = init({
  debug: process.env.NODE_ENV === 'development',
});