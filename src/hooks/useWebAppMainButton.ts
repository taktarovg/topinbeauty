// src/hooks/useWebAppMainButton.ts
import { useMainButton } from '@telegram-apps/sdk-react';

export function useWebAppMainButton({
  text,
  color = '#2481cc',
  textColor = '#ffffff',
  onClick,
  isActive = true,
  isVisible = true
}) {
  const mainButton = useMainButton();

  useEffect(() => {
    if (!mainButton) return;

    mainButton.setText(text);
    mainButton.setParams({
      color,
      text_color: textColor,
    });
    mainButton.onClick(onClick);

    if (isVisible) {
      mainButton.show();
    } else {
      mainButton.hide();
    }

    if (isActive) {
      mainButton.enable();
    } else {
      mainButton.disable();
    }

    return () => {
      mainButton.offClick(onClick);
      mainButton.hide();
    };
  }, [mainButton, text, color, textColor, onClick, isActive, isVisible]);

  return {
    setLoading: mainButton?.showProgress,
    setText: mainButton?.setText,
    isReady: !!mainButton
  };
}