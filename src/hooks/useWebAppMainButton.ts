// src/hooks/useWebAppMainButton.ts
'use client';

import { useEffect } from 'react';
import { WebApp } from '@/lib/telegram-sdk';

export function useWebAppMainButton({
  text,
  color = '#2481cc',
  textColor = '#ffffff',
  onClick,
  isActive = true,
  isVisible = true,
}: {
  text: string;
  color?: string;
  textColor?: string;
  onClick: () => void;
  isActive?: boolean;
  isVisible?: boolean;
}) {
  const mainButton = WebApp.MainButton;

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
    isReady: !!mainButton,
  };
}