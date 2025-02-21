// src/providers/AuthProvider.tsx
'use client'

import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TelegramProvider } from '@/lib/telegram-init'
import { useToast } from '@/components/ui/use-toast'
import type { User } from '@prisma/client'

interface AuthContextType {
  user: User | null;
  login: (telegramData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <TelegramProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </TelegramProvider>
  );
}

function AuthProviderInner({ children }: { children: ReactNode }) {
  // ... остальной код AuthProvider без изменений ...
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}