// src/lib/telegram-sdk.ts
import { init } from '@telegram-apps/sdk';
import { SDKProvider } from '@telegram-apps/sdk-react';

// Инициализируем SDK
export const WebApp = init({
    debug: process.env.NODE_ENV === 'development'
});

// Экспортируем провайдер для React
export { SDKProvider };

// Экспортируем типы для TypeScript
export type { User } from '@telegram-apps/sdk';