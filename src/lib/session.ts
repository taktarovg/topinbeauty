// src/lib/session.ts - update
import { cookies } from 'next/headers'
import { getToken, setToken } from './token'
import { prisma } from './prisma'
import type { Session } from '@/types'

const SESSION_TOKEN_NAME = 'session_token'

export async function createSession(userId: number) {
    console.log('Creating session for user:', userId)
    const token = setToken({ userId })

    cookies().set({
        name: SESSION_TOKEN_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60
    })

    return token
}

// export async function getSession(): Promise<Session | null> {
//     const sessionToken = cookies().get(SESSION_TOKEN_NAME)?.value
//     console.log('Getting session, token exists:', !!sessionToken)

//     if (!sessionToken) {
//         return null
//     }

//     const payload = getToken(sessionToken)
//     console.log('Token payload:', payload)

//     if (!payload?.userId) {
//         console.log('Invalid token payload')
//         return null
//     }

//     try {
//         const user = await prisma.user.findUnique({
//             where: { id: payload.userId },
//             select: {
//                 id: true,
//                 telegramId: true,
//                 username: true,
//                 firstName: true,
//                 lastName: true,
//                 role: true
//             }
//         })

//         console.log('Session user data:', user)

//         if (!user) {
//             console.log('User not found in database')
//             return null
//         }

//         return {
//             user: {
//                 ...user,
//                 id: user.id // Теперь это точно number
//             }
//         }
//     } catch (error) {
//         console.error('Error getting session:', error)
//         return null
//     }
// }

// export async function clearSession() {
//     console.log('Clearing session')
//     cookies().delete(SESSION_TOKEN_NAME)
// }

export async function getSession() {
    const sessionToken = cookies().get(SESSION_TOKEN_NAME)?.value
    console.log('[Session] Cookie token:', sessionToken)

    if (!sessionToken) {
        console.log('[Session] No token found')
        return null
    }

    const payload = getToken(sessionToken)
    console.log('[Session] Token payload:', payload)

    if (!payload?.userId) {
        console.log('[Session] Invalid token payload')
        return null
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                city: true,
                district: true
            }
        })

        console.log('[Session] Found user:', user)

        if (!user) {
            console.log('[Session] User not found in database')
            return null
        }

        return { user }
    } catch (error) {
        console.error('[Session] Error getting session:', error)
        return null
    }
}