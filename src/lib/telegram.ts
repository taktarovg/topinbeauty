// src/lib/telegram.ts
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { TelegramBotError } from '@/types/errors';
import type { BookingWithRelations } from '@/types/booking';

// Типизация для Telegram WebApp (используется только для клиентских функций)
export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
      premium?: boolean;
    };
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    hint_color?: string;
  };
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  expand(): void;
  hapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy'): void;
  };
  BackButton?: {
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton?: {
    setText(text: string): void;
    setParams(params: { color: string; text_color: string }): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    showProgress(): void;
    hideProgress(): void;
  };
  close(): void;
  showPopup(params: { message: string; buttons: { type: string }[] }): Promise<void>;
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

if (!BOT_TOKEN) {
  throw new Error('TELEGRAM_BOT_TOKEN is not defined');
}

// Существующие функции для работы с ботом
export async function sendTelegramMessage(chatId: string, text: string) {
  if (!BOT_TOKEN) return;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new TelegramBotError(`Failed to send message: ${error.description}`, response.status);
    }

    return await response.json();
  } catch (error) {
    console.error('Telegram bot error:', error);
  }
}

export async function sendBookingNotification(booking: BookingWithRelations, masterChatId: string, clientChatId: string) {
  if (!masterChatId || !clientChatId) {
    console.log('Missing telegram IDs for notification');
    return;
  }

  const bookingDate = format(new Date(booking.bookingDateTime), 'dd MMMM yyyy в HH:mm', { locale: ru });

  const masterMessage = `
🆕 Новая запись!

Клиент: ${booking.user.firstName} ${booking.user.lastName || ''}
Услуга: ${booking.service.name}
Дата: ${bookingDate}
Статус: ${getBookingStatusText(booking.status)}

${booking.notes ? `\nКомментарий: ${booking.notes}` : ''}
`;

  const clientMessage = `
✅ Запись создана!

Мастер: ${booking.service.master.user.firstName} ${booking.service.master.user.lastName}
Услуга: ${booking.service.name}
Дата: ${bookingDate}
Статус: ${getBookingStatusText(booking.status)}

${booking.status === 'PENDING' ? '\nОжидайте подтверждения от мастера.' : ''}
`;

  try {
    await Promise.allSettled([
      sendTelegramMessage(masterChatId, masterMessage),
      sendTelegramMessage(clientChatId, clientMessage),
    ]);
  } catch (error) {
    console.error('Failed to send booking notifications:', error);
  }
}

export async function sendBookingStatusNotification(booking: BookingWithRelations) {
  if (!booking.user.telegramId) {
    console.log('Missing client telegram ID for status notification');
    return;
  }

  const bookingDate = format(new Date(booking.bookingDateTime), 'dd MMMM yyyy в HH:mm', { locale: ru });

  const clientMessage = `
📝 Статус записи изменен!

Мастер: ${booking.service.master.user.firstName} ${booking.service.master.user.lastName}
Услуга: ${booking.service.name}
Дата: ${bookingDate}
Новый статус: ${getBookingStatusText(booking.status)}
`;

  try {
    await sendTelegramMessage(booking.user.telegramId, clientMessage);
  } catch (error) {
    console.error('Failed to send status notification:', error);
  }
}

export async function sendBookingReminder(booking: BookingWithRelations) {
  try {
    const bookingDate = format(new Date(booking.bookingDateTime), 'dd MMMM yyyy в HH:mm', { locale: ru });

    if (booking.user.telegramId) {
      const clientMessage = `
⏰ Напоминание о записи!

Мастер: ${booking.service.master.user.firstName} ${booking.service.master.user.lastName}
Услуга: ${booking.service.name}
Дата: ${bookingDate}
`;
      await sendTelegramMessage(booking.user.telegramId, clientMessage);
    }

    if (booking.service.master.user.telegramId) {
      const masterMessage = `
⏰ Напоминание о клиенте!

Клиент: ${booking.user.firstName} ${booking.user.lastName}
Услуга: ${booking.service.name}
Дата: ${bookingDate}
`;
      await sendTelegramMessage(booking.service.master.user.telegramId, masterMessage);
    }
  } catch (error) {
    console.error('Failed to send reminder notifications:', error);
  }
}

// Вспомогательные функции
function getBookingStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    PENDING: 'Ожидает подтверждения',
    CONFIRMED: 'Подтверждена',
    CANCELED: 'Отменена',
    COMPLETED: 'Завершена',
  };
  return statusTexts[status] || status;
}

// Клиентские утилиты (зависят от WebApp)
export function isTelegramMiniApp(): boolean {
  // Импортируем WebApp только для клиентских функций
  const { WebApp } = require('./telegram-sdk');
  return typeof window !== 'undefined' && !!WebApp.initData;
}

export function getTelegramThemeParams() {
  const { WebApp } = require('./telegram-sdk');
  if (!isTelegramMiniApp()) {
    return {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      buttonColor: '#2481cc',
      buttonTextColor: '#ffffff',
    };
  }

  const { bg_color, text_color, button_color, button_text_color } = WebApp.themeParams;
  return {
    backgroundColor: bg_color || '#ffffff',
    textColor: text_color || '#000000',
    buttonColor: button_color || '#2481cc',
    buttonTextColor: button_text_color || '#ffffff',
  };
}

export function configureWebApp() {
  const { WebApp } = require('./telegram-sdk');
  if (!isTelegramMiniApp()) return;

  try {
    WebApp.setHeaderColor('secondary_bg_color');
    WebApp.setBackgroundColor('bg_color');
    WebApp.expand();
    WebApp.hapticFeedback.impactOccurred('light');
    if (WebApp.BackButton) {
      WebApp.BackButton.show();
    }
  } catch (error) {
    console.error('Failed to configure WebApp:', error);
  }
}

export function getTelegramUser() {
  const { WebApp } = require('./telegram-sdk');
  if (!WebApp.initDataUnsafe?.user) {
    return null;
  }

  const { user } = WebApp.initDataUnsafe;
  return {
    telegramId: user.id.toString(),
    username: user.username || null,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    avatar: user.photo_url || null,
    isPremium: user.premium || false,
  };
}

export function handleTelegramClick(callback: () => void) {
  const { WebApp } = require('./telegram-sdk');
  if (isTelegramMiniApp()) {
    WebApp.hapticFeedback.impactOccurred('light');
  }
  callback();
}

export function closeTelegramWebApp() {
  const { WebApp } = require('./telegram-sdk');
  if (isTelegramMiniApp()) {
    WebApp.close();
  }
}

export function showTelegramAlert(message: string, callback?: () => void) {
  const { WebApp } = require('./telegram-sdk');
  if (isTelegramMiniApp()) {
    WebApp.showPopup({
      message,
      buttons: [{ type: 'ok' }],
    }).then(callback);
  }
}