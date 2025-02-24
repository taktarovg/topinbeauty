// src/lib/telegram-init.ts

'use client'; // Добавляем директиву для изоляции клиентского кода

import { WebApp } from './telegram-sdk'; // Импортируем готовый WebApp
import type { TelegramWebApp } from './telegram-client';

// Экспортируем тип пользователя из TelegramWebApp
export type WebAppUser = NonNullable<TelegramWebApp['initDataUnsafe']['user']>;

// Функция для проверки окружения Telegram Mini App
export function isTelegramMiniApp(): boolean {
  return !!WebApp.initData; // Проверяем наличие initData для определения окружения Telegram
}