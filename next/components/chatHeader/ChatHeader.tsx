"use client"

import React from 'react'
import { useLocalStorage } from "@/hooks/useLocalStorage";
const ChatHeader = () => {
  const { value: selectedUser, setValue: setSelectedUser } = useLocalStorage(
    "chat.selectedUser",
    "chats"
  );
  return (
    <div className='fixed top-0 left-0 md:left-[256px] p-2 bg:white w-[100%] bg-white z-8 md:w-[calc(100%-256px)] border-b border-gray-400'>{(selectedUser as any).name} {(selectedUser as any).email}</div>
  )
}

export default ChatHeader