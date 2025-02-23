
// src/app/api/auth/telegram/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/session'
import { z } from 'zod'

const telegramAuthSchema = z.object({
  id: z.number(),
  first_name: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  auth_date: z.number(),
  hash: z.string()
})

export async function POST(request: Request) {
  try {
    const rawData = await request.json()
    console.log('=== AUTH START ===')
    console.log('Raw Telegram auth data:', rawData)

    const data = telegramAuthSchema.parse(rawData)
    console.log('Validated Telegram data:', data)

    // Дополнительная проверка для Mini App
    const isMiniApp = request.headers.get('x-telegram-mini-app') === 'true'

    // Преобразуем данные для создания/обновления пользователя
    const userData = {
      telegramId: data.id.toString(),
      username: data.username,
      firstName: data.first_name || '',
      lastName: '', // Telegram может не предоставить lastName
      avatar: data.photo_url
    }

    console.log('Transformed user data:', userData)

    // Поиск существующего пользователя
    let user = await prisma.user.findUnique({
      where: {
        telegramId: userData.telegramId,
      },
    })

    console.log('Existing user check result:', user)

    if (user) {
      // Обновляем существующего пользователя
      user = await prisma.user.update({
        where: {
          telegramId: userData.telegramId
        },
        data: {
          username: userData.username || user.username,
          firstName: userData.firstName || user.firstName,
          lastName: userData.lastName || user.lastName,
          avatar: userData.avatar || user.avatar
        }
      })
      console.log('Updated existing user:', user)
    } else {
      // Создаем нового пользователя
      try {
        user = await prisma.user.create({
          data: {
            ...userData,
            role: 'USER',
            isPremium: false
          },
        })
        console.log('Created new user:', user)
      } catch (createError) {
        console.error('User creation error:', createError)
        throw createError
      }
    }

    // Создаем сессию
    const sessionToken = await createSession(user.id)
    console.log('Created session token:', !!sessionToken)
    console.log('=== AUTH END ===')

    // Для Mini App возвращаем дополнительные данные
    if (isMiniApp) {
      return NextResponse.json({
        success: true,
        user,
        sessionToken,
        miniApp: {
          version: '1.0',
          platform: 'telegram'
        }
      })
    }

    return NextResponse.json({ 
      success: true,
      user,
      sessionToken 
    })
  } catch (error) {
    console.error('=== AUTH ERROR ===')
    console.error('Full error:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      {
        error: 'Auth failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}