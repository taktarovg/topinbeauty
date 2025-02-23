// src/lib/telegram-client.ts
import { WebApp } from './telegram-sdk'; // Импортируем WebApp здесь

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

export function isTelegramMiniApp(): boolean {
    return typeof window !== 'undefined' && !!WebApp.initData;
}

export function getTelegramThemeParams() {
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
    if (isTelegramMiniApp()) {
        WebApp.hapticFeedback.impactOccurred('light');
    }
    callback();
}

export function closeTelegramWebApp() {
    if (isTelegramMiniApp()) {
        WebApp.close();
    }
}

export function showTelegramAlert(message: string, callback?: () => void) {
    if (isTelegramMiniApp()) {
        WebApp.showPopup({
            message,
            buttons: [{ type: 'ok' }],
        }).then(callback);
    }
}