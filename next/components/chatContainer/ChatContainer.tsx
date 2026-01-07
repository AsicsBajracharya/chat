"use client";
import { useAuthUser } from "@/features/auth/auth.hooks";
import {
  useMessagesByUserId,
  useSubscribeToMessages,
} from "@/features/chat/chat.hooks";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import React, { useEffect, useRef, useState } from "react";
import MessageInput from "../MessageInput/MessageInput";

const ChatContainer = () => {
  const { isTyping, isStopTyping, selectedUser: userTyping } = useSubscribeToMessages();
  const { value: selectedUser, setValue: setSelectedUser } = useLocalStorage(
    "chat.selectedUser",
    "chats"
  );
  const [isChangeInView, setisChangeInView] = useState(false);

  const { data: authUser, isLoading: isUserLoading } = useAuthUser();
  const userId = (selectedUser  as any)?._id;
  // console.log('selecteduser', selectedUser)

  useEffect(() =>{
    console.log('~~chathooks', isStopTyping, isTyping, userTyping)
  },[isStopTyping, isTyping, userTyping])

  const {
    data: messages = [],

    isLoading: isMessagesLoading,
  } = useMessagesByUserId(userId);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // console.log("change in view");
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChangeInView]);

  if (!userId) {
    return <div className="p-4 text-slate-500">Select a chat</div>;
  }
  return (
    <>
      {messages.length > 0 && !isMessagesLoading ? (
        <div className="max-w-3xl h-[calc(100%-72px)] mx-auto space-y-6 flex flex-col justify-end">
          <div className="h-auto">
            {messages.map((msg: any) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {(selectedUser as any)._id === userTyping?._id && isTyping && !isStopTyping && (
              <p className="text-sm">typing...</p>
            )}
          </div>

          {/* scroll target */}
          <div ref={messageEndRef} />
        </div>
      ) : isMessagesLoading ? (
        //   <MessagesLoadingSkeleton />
        <div className="h-[calc(100%-72px)] w-full flex items-center justify-center">
          <h1>loading...</h1>
        </div>
      ) : (
        //   <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        <div className="h-[calc(100%-72px)] w-full flex items-center justify-center">
          <h1>no messages</h1>
        </div>
      )}
      <MessageInput setisChangeInView={setisChangeInView} />
    </>
  );
};

export default ChatContainer;
