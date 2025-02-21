// src/lib/telegram-init.ts
import { WebApp } from '@telegram-apps/sdk';
import { TelegramProvider, useTelegramUser, useTelegramWebApp } from '@telegram-apps/sdk-react';

export { WebApp, TelegramProvider, useTelegramUser, useTelegramWebApp };

// Добавляем типы
export type { WebAppUser } from '@telegram-apps/sdk';