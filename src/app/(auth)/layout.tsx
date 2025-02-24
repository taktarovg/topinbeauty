// src/app/(auth)/layout.tsx


'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Динамически импортируем AuthProvider с отключением SSR
const AuthProvider = dynamic(() => import('@/providers/AuthProvider').then(mod => mod.AuthProvider), {
  ssr: false,
});

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <AuthProvider>{children}</AuthProvider>
      </div>
    </div>
  );
}