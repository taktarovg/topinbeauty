// src/lib/telegram-sdk.ts
'use client'; // Добавляем директиву для изоляции клиентского кода

import { init } from '@telegram-apps/sdk';
import type { TelegramWebApp } from './telegram-client';

// Инициализируем SDK с явной типизацией
export const WebApp: TelegramWebApp = init({
  debug: process.env.NODE_ENV === 'development',
});