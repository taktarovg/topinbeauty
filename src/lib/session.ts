// src/lib/session.ts
import { sign, verify } from 'jsonwebtoken';
import { NextRequest } from 'next/server'; // Для типизации запроса

/**
 * Получает сессию пользователя из токена в заголовке Authorization (для серверных API-роутов).
 * @param request - Объект запроса Next.js
 * @returns Объект сессии или null, если токен отсутствует или недействителен
 */
export async function getSession(request: NextRequest) {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return null;

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        const decoded = verify(token, secret) as { userId: number };
        return { user: { id: decoded.userId } };
    } catch (error) {
        console.error('Session verification error:', error);
        return null;
    }
}

/**
 * Создает сессионный токен (JWT) для пользователя.
 * @param userId - ID пользователя
 * @returns Promise<string> - Сгенерированный JWT-токен
 */
export async function createSession(userId: number): Promise<string> {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return sign({ userId }, secret, { expiresIn: '7d' });
}

/**
 * Очищает сессию пользователя (в данном случае ничего не делает на сервере,
 * так как токен хранится на клиенте в localStorage).
 * @returns Promise<void>
 */
export async function clearSession(): Promise<void> {
    // Поскольку сессия управляется через localStorage на клиенте,
    // серверная очистка не требуется. Эта функция оставлена для совместимости
    // и может быть расширена, если вы добавите серверное управление сессиями.
    return Promise.resolve();
}