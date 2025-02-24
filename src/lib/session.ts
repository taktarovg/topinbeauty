// src/lib/session.ts
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Импорт для серверных компонентов
import { prisma } from './prisma'; // Импорт Prisma для поиска пользователя

/**
 * Получает сессию пользователя из токена в cookies (для серверных компонентов).
 * @param options - Объект с cookies, полученными через next/headers
 * @returns Объект сессии или null, если токен отсутствует или недействителен
 */
export async function getSession({ cookies }: { cookies: ReturnType<typeof cookies> }) {
  const sessionToken = cookies.get('sessionToken')?.value;
  if (!sessionToken) return null;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const decoded = verify(sessionToken, secret) as { userId: number };

    // Используем Prisma для получения данных пользователя
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    return user ? { user } : null;
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