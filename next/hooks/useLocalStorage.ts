// hooks/useLocalStorage.ts
"use client";

import { useCallback, useEffect, useState } from "react";

type SetValue<T> = T | ((prev: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch (err) {
      console.warn(`useLocalStorage(${key}) read error`, err);
    } finally {
      setHydrated(true);
    }
  }, [key]);

  // Sync across same tab + other tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setValue(JSON.parse(e.newValue));
      }
    };

    const onCustom = (e: Event) => {
      const ce = e as CustomEvent<T>;
      setValue(ce.detail);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(`ls:${key}`, onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(`ls:${key}`, onCustom);
    };
  }, [key]);

  const setStoredValue = useCallback(
    (val: SetValue<T>) => {
      setValue((prev) => {
        const next = val instanceof Function ? val(prev) : val;

        try {
          localStorage.setItem(key, JSON.stringify(next));
          window.dispatchEvent(
            new CustomEvent(`ls:${key}`, { detail: next })
          );
        } catch (err) {
          console.warn(`useLocalStorage(${key}) write error`, err);
        }

        return next;
      });
    },
    [key]
  );

  return { value, setValue: setStoredValue, hydrated };
}
