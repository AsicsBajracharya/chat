"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useAuthUser, useLogout } from "@/features/auth/auth.hooks";
import UserCard from "@/components/userCard/UserCard";
import ActiveTabSwitch from "@/components/activeTabSwitch/ActiveTabSwitch";
import { useActiveTab } from "@/features/chat/useActiveTab";
import ChatList from "@/components/chatList/ChatList";
import ContactList from "@/components/contactList/ContactList";
import { LogOutIcon, Menu, Volume2Icon, VolumeOffIcon } from "lucide-react";
import { useSound } from "@/features/chat/useSound";
import { initNotificationSound } from "@/utils/notificationSound";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

type Props = { children: React.ReactNode };

export default function ProtectedLayout({ children }: Props) {
  const { data: user, isLoading } = useAuthUser();
  const { activeTab, setActiveTab } = useActiveTab();
  const {mutate:logout, isPending} = useLogout()
  const { isSoundEnabled, toggleSound, hydrated } = useSound();

  if (!hydrated) return null;
  if (isLoading) return null; 
  if (!user) redirect("/login");

  return (
    <div className="drawer md:drawer-open h-screen">
      <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
      {/* Sidebar */}
      <aside className="max-h-screen drawer-side overflow-scroll">
        <label
          htmlFor="mobile-drawer"
          className="drawer-overlay md:hidden"
        ></label>
        <div className="w-64 bg-base-500 border-r border-gray-200 bg-white height-[100vh] min-h-screen flex flex-col">
          {/* Brand */}
          <div className="navbar border-b border-gray-300">
            <div className="flex-1 py-2 md:py-4">
              <span className="text-md md:text-lg font-bold">My App</span>
            </div>
             {/* LOGOUT BTN */}
             <div className="flex gap-2">
             <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => logout()}
          >
            <LogOutIcon className="size-5" />
          </button>
          <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              initNotificationSound(); 
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
             </div>
         
          </div>

          {/* User card */}
          <UserCard name={user.name} email={user.email} />

          <ActiveTabSwitch activeTab={activeTab} onChange={setActiveTab} />

          <div className="flex-1 h-[80%] overflow-y-auto p-2 md:p-4 space-y-1 md:space-y-2">
            {activeTab === "chats" ? <ChatList /> : <ContactList />}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="h-[100%] drawer-content flex flex-grow flex-col overflow-scroll">
        <label
          htmlFor="mobile-drawer"
          className="btn btn-ghost md:hidden absolute top-2 right-2 z-10 bg-white"
        >
          <Menu />
        </label>
        {/* Content area */}
        <main className="h-full p-2 md:p-4 md:px-6">
          <div className="h-[100%] card bg-base-100">
            <div className="card-body p-2 md:p-4 md:px-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
