// src/hooks/useAuth.ts
'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  telegramId: string
  username: string | null
  firstName: string | null
  lastName: string | null
  role: 'USER' | 'MASTER' | 'ADMIN'
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export function useAuth() {
  const router = useRouter()
  const { setUser, setError, setLoading } = useAuthStore()

  const login = useCallback(async (telegramData: any) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: telegramData.id.toString(),
          username: telegramData.username,
          firstName: telegramData.first_name,
          lastName: telegramData.last_name,
        }),
      })

      if (!response.ok) {
        throw new Error('Auth failed')
      }

      const { user } = await response.json()
      setUser(user)
      router.push('/')
    } catch (error) {
      console.error('Auth error:', error)
      setError(error instanceof Error ? error.message : 'Authentication failed')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [router, setUser, setError, setLoading])

  const logout = useCallback(() => {
    setUser(null)
    router.push('/login')
  }, [router, setUser])

  return {
    ...useAuthStore(),
    login,
    logout,
  }
}