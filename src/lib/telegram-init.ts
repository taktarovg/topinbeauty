// src/lib/telegram-init.ts
import { init, type WebAppUser } from '@telegram-apps/sdk';

// Инициализируем WebApp для глобального доступа
export const WebApp = init({
    debug: process.env.NODE_ENV === 'development',
});

// Экспортируем необходимые типы и функции из @telegram-apps/sdk
export type { WebAppUser };

// Реэкспортируем только существующие сущности из @telegram-apps/sdk
// Избегаем экспорта устаревших или несуществующих элементов (например, useSDK, TelegramProvider)
export { init } from '@telegram-apps/sdk';

// Примечание: @telegram-apps/sdk-react не реэкспортируется полностью, так как хуки вроде useTelegramUser, TelegramProvider отсутствуют в версии 3.1.0.
// Если в проекте используются кастомные хуки или компоненты, их нужно определить отдельно.