// src/app/(public)/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider'; // Убедитесь, что QueryProvider серверный или изолирован
import { Header } from '@/components/layout/Header'; // Убедитесь, что Header серверный
import { Navigation } from '@/components/layout/Navigation'; // Убедитесь, что Navigation серверный
import { Toaster } from '@/components/ui/toaster'; // Убедитесь, что Toaster серверный или изолирован
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'TopInBeauty - Запись к мастерам красоты',
  description: 'Онлайн запись к лучшим мастерам красоты через Telegram',
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
          <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <main className="flex-1 pb-16">{children}</main>
            <Navigation />
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}