// src/hooks/useWebAppBackButton.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WebApp } from '@/lib/telegram';

export function useWebAppBackButton(enabled: boolean = true) {
  const router = useRouter();

  useEffect(() => {
    const backButton = WebApp.BackButton;

    if (!backButton) return;

    if (enabled) {
      backButton.show();
      const handleBack = () => {
        router.back();
      };
      backButton.onClick(handleBack);

      return () => {
        backButton.offClick(handleBack);
        backButton.hide();
      };
    } else {
      backButton.hide();
    }
  }, [enabled, router]);

  return {
    isReady: !!WebApp.BackButton,
  };
}