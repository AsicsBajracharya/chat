"use client";

import React from "react";
import type { ActiveTab } from "@/features/chat/useActiveTab";

export default function ActiveTabSwitch({
  activeTab,
  onChange,
}: {
  activeTab: ActiveTab;
  onChange: (tab: ActiveTab) => void;
  
}) {

  const baseBtn =
  "w-full px-2 md:px-4 py-2 rounded-lg transition focus:outline-none focus:ring-2 text-sm md:text-base";

const activeBtn =
  "bg-blue-600 px-2 md:px-4 py-2  text-white hover:bg-blue-700 focus:ring-blue-500 text-sm md:text-base";

const inactiveBtn =
  "bg-blue-600/10 px-2 md:px-4 py-2 text-blue-600 hover:bg-blue-600/20 focus:ring-blue-400 text-sm md:text-base";

  return (
    <div className="flex gap-2 p-2">
    <button
      onClick={() => onChange("chats")}
      className={`${baseBtn} ${
        activeTab === "chats" ? activeBtn : inactiveBtn
      }`}
    >
      Chats
    </button>

    <button
      onClick={() => onChange("contacts")}
      className={`${baseBtn} ${
        activeTab === "contacts" ? activeBtn : inactiveBtn
      }`}
    >
      Contacts
    </button>
  </div>
  );
}
