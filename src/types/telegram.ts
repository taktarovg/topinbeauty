// src/types/telegram.ts
import type { User } from '@telegram-apps/sdk';

export interface TelegramAuthData {
    user: User;
    hash: string;
    auth_date: number;
}

export interface TelegramThemeParams {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
}