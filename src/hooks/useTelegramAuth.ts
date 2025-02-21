// src/hooks/useTelegramAuth.ts - update
'use client'

import { useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

export function useTelegramAuth() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initTelegram = async () => {
      if (!WebApp.isInitialized) return

      try {
        const user = WebApp.initDataUnsafe?.user
        if (!user) return

        // Автоматическая настройка темы и основного цвета
        WebApp.setHeaderColor('#000000')
        WebApp.setBackgroundColor('#FFFFFF')

        // Расширяем видимую область
        WebApp.expand()

      } catch (error) {
        console.error('Telegram init error:', error)
        toast({
          title: 'Ошибка инициализации',
          description: 'Не удалось инициализировать Telegram Mini App',
          variant: 'destructive'
        })
      }
    }

    initTelegram()
  }, [router, toast])
}