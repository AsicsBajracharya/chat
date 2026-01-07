"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useSound() {
  const {
    value: isSoundEnabled,
    setValue: setIsSoundEnabled,
    hydrated,
  } = useLocalStorage<boolean>("chat.isSoundEnabled", true);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  return {
    isSoundEnabled,
    toggleSound,
    hydrated,
  };
}