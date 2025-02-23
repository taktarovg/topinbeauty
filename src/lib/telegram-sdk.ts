// src/lib/telegram-sdk.ts
import { init } from '@telegram-apps/sdk';
import { SDKProvider } from '@telegram-apps/sdk-react';
import type { TelegramWebApp } from './telegram'; // Импортируем тип из telegram.ts

// Инициализируем SDK с явной типизацией
export const WebApp: TelegramWebApp = init({
  debug: process.env.NODE_ENV === 'development',
});

// Экспортируем провайдер для React
export { SDKProvider };

// Экспортируем типы для TypeScript (User из @telegram-apps/sdk не нужен, используем TelegramWebApp)