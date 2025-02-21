// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from '@/lib/token'

const publicRoutes = [
    '/',
    '/login',
    '/api/auth/telegram',
    '/api/categories',
    '/services/(.*)'
]

const staticPaths = [
    '/_next',
    '/images',
    '/uploads',
    '/favicon.ico'
]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    console.log('Middleware handling path:', pathname)

    // Пропускаем статические файлы
    if (staticPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    // Проверяем, является ли запрос из Telegram WebApp
    const isTelegramWebApp = request.headers.get('x-telegram-webapp') === 'true'
    const isTelegramMiniApp = request.headers.get('x-telegram-mini-app') === 'true'
    const isTelegramRequest = isTelegramWebApp || isTelegramMiniApp

    // Получаем сессионный токен
    const sessionToken = request.cookies.get('session_token')?.value
    console.log('Session token:', sessionToken ? 'exists' : 'not found')

    let session = null
    if (sessionToken) {
        try {
            const payload = getToken(sessionToken)
            if (payload?.userId) {
                session = { userId: payload.userId }
                console.log('Valid session found:', session)
            }
        } catch (error) {
            console.error('Token validation error:', error)
        }
    }

    // Проверяем, является ли маршрут публичным
    const isPublicRoute = publicRoutes.some(route => {
        if (route.includes('(.*)')) {
            const regexRoute = route.replace('(.*)', '.*')
            return new RegExp(`^${regexRoute}$`).test(pathname)
        }
        return route === pathname
    })

    // API routes handling
    if (pathname.startsWith('/api/')) {
        // Разрешаем запросы авторизации из Telegram
        if (isTelegramRequest && pathname.startsWith('/api/auth/')) {
            return NextResponse.next()
        }

        if (!session && !isPublicRoute) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
        return NextResponse.next()
    }

    // Если пользователь не авторизован и пытается получить доступ к защищенному маршруту
    if (!session && !isPublicRoute) {
        console.log('Unauthorized access attempt, redirecting to login')
        
        // Если запрос из Telegram, возвращаем 401 вместо редиректа
        if (isTelegramRequest) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
        
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Редирект с /login если пользователь уже авторизован
    if (session && pathname === '/login') {
        console.log('Authorized user attempting to access login page, redirecting to profile')
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Добавляем заголовки для Telegram WebApp
    const response = NextResponse.next()
    if (isTelegramRequest) {
        response.headers.set('x-telegram-sdk-version', '3.4.0')
    }

    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}