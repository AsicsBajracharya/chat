// features/chat/useActiveTab.ts
"use client";

import { useEffect, useState } from "react";

export type ActiveTab = "chats" | "contacts";

const STORAGE_KEY = "chat.activeTab";

export function useActiveTab() {
  const [activeTab, setActiveTabState] = useState<ActiveTab>("chats");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ActiveTab | null;
    if (stored === "chats" || stored === "contacts") {
      setActiveTabState(stored);
    }
  }, []);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    localStorage.setItem(STORAGE_KEY, tab);
  };

  return { activeTab, setActiveTab };
}
