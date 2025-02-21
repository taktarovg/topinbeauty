// src/lib/token.ts - new
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key' // В продакшене использовать безопасный ключ

interface TokenPayload {
    userId: number
    iat?: number
    exp?: number
}

export function setToken(payload: TokenPayload): string {
    const now = Math.floor(Date.now() / 1000)

    const tokenPayload = {
        ...payload,
        iat: now,
        exp: now + (30 * 24 * 60 * 60) // 30 дней
    }

    return Buffer.from(JSON.stringify(tokenPayload)).toString('base64')
}

export function getToken(token: string): TokenPayload | null {
    try {
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString())

        // Проверяем срок действия токена
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return null
        }

        return decoded
    } catch {
        return null
    }
}

export function removeToken(token: string): void {
    // Здесь может быть логика для инвалидации токена
    // Например, добавление в черный список
}