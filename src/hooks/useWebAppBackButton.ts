// src/hooks/useWebAppBackButton.ts
import { useBackButton } from '@telegram-apps/sdk-react';
import { useRouter } from 'next/navigation';

export function useWebAppBackButton(enabled: boolean = true) {
  const router = useRouter();
  const backButton = useBackButton();

  useEffect(() => {
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
  }, [enabled, backButton, router]);

  return {
    isReady: !!backButton
  };
}