// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic'; // Убедитесь, что импорт есть
import { QueryProvider } from '@/providers/QueryProvider';
import { Header } from '@/components/layout/Header';
import { Navigation } from '@/components/layout/Navigation';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

// Динамически импортируем AuthProvider с отключением SSR
const AuthProvider = dynamic(() => import('@/providers/AuthProvider').then(mod => mod.AuthProvider), {
  ssr: false, // Отключаем серверный рендеринг
});

export const metadata: Metadata = {
  title: 'TopInBeauty - Запись к мастерам красоты',
  description: 'Онлайн запись к лучшим мастерам красоты',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col bg-gray-50">
              <Header />
              <main className="flex-1 pb-16">{children}</main>
              <Navigation />
            </div>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}