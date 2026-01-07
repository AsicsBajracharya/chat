"use client"
import { useMyChatPartners, useSubscribeToMessages } from '@/features/chat/chat.hooks'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import React, { useEffect } from 'react'

const ChatList = () => {

  const {data, isLoading} = useMyChatPartners()
  const { value: selectedUser, setValue: setSelectedUser } = useLocalStorage(
    "chat.selectedUser",
    "chats"
  );

  const closeDrawer = () => {
    const drawer = document.getElementById(
      "mobile-drawer"
    ) as HTMLInputElement;
  
    if (drawer) drawer.checked = false;
  };

  // useEffect(() =>{
  //   console.log('data', data)
  //   console.log('isloading', isLoading)
  // },[data])
  return (
    <>
    {data?.map((chat:any) => (
        <div
          key={chat._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => {
            setSelectedUser(chat)
            // closeDrawer()
          }}
        >
          <div className="flex items-center gap-3">
            <div className={`avatar `}>
              <div className="size-12 rounded-full">
                <img src={chat.profilePicture || "/avatar.png"} alt={chat.name} />
              </div>
            </div>
            <h4 className="text-black-200 font-medium truncate">{chat.name}</h4>
          </div>
        </div>
      ))}
    
    </>
  )
}

export default ChatList