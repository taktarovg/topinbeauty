// src/app/(public)/_not-found/page.tsx - new

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-2xl font-bold mb-4">Страница не найдена</h2>
      <p className="text-muted-foreground text-center mb-8">
        К сожалению, запрашиваемая страница не существует или была удалена
      </p>
      <Button asChild>
        <Link href="/">
          Вернуться на главную
        </Link>
      </Button>
    </div>
  );
}