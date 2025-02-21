// topinbeauty\src\store\auth.ts

import { create } from 'zustand'
import { User } from '@prisma/client'

interface AuthState {
    user: User | null
    setUser: (user: User) => void
    clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}))