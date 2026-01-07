"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { chatApi } from "./chat.api";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSocket } from "../socket/socketProvider";
const notificationSound = new Audio("/sounds/notification.mp3");

export const chatKeys = {
  contacts: ["chat", "contacts"] as const,
  chats: ["chat", "partners"] as const,
  messages: (userId: string) => ["chat", "messages", userId] as const,
};

export function useAllContacts() {
  return useQuery({
    queryKey: chatKeys.contacts,
    queryFn: chatApi.getAllContacts,
    staleTime: 60_000,
  });
}

export function useMyChatPartners() {
  return useQuery({
    queryKey: chatKeys.chats,
    queryFn: chatApi.getMyChatPartners,
    staleTime: 30_000,
  });
}

export function useMessagesByUserId(userId?: string) {
  return useQuery({
    queryKey: userId ? chatKeys.messages(userId) : ["chat", "messages", "none"],
    queryFn: () => chatApi.getMessagesByUserId(userId as string),
    enabled: !!userId,
    staleTime: 5_000,
  });
}

/**
 * Optimistic sendMessage (like your Zustand logic)
 * - Adds temp message immediately
 * - Replaces/merges with server response
 * - Rollbacks on error
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.sendMessage,

    onMutate: async ({
      receiverId,
      messageData,
      senderId,
    }: {
      receiverId: string;
      senderId: string;
      messageData: { text?: string; image?: string };
    }) => {
      // cancel ongoing fetches
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(receiverId),
      });

      // snapshot previous
      const prev =
        queryClient.getQueryData<any[]>(chatKeys.messages(receiverId)) || [];

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        _id: tempId,
        senderId,
        receiverId,
        text: messageData.text,
        image: messageData.image,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      // set optimistic cache
      queryClient.setQueryData<any[]>(chatKeys.messages(receiverId), [
        ...prev,
        optimisticMessage,
      ]);

      // return context for rollback
      return { prev, receiverId, tempId };
    },

    onError: (err: any, _vars, ctx) => {
      if (ctx?.receiverId) {
        queryClient.setQueryData(chatKeys.messages(ctx.receiverId), ctx.prev);
      }
      toast.error(err?.response?.data?.message || "Something went wrong");
    },

    onSuccess: (serverMessage, _vars, ctx) => {
      if (!ctx?.receiverId) return;

      // Replace temp with server message (or append if not found)
      queryClient.setQueryData<any[]>(
        chatKeys.messages(ctx.receiverId),
        (curr = []) => {
          const idx = curr.findIndex((m) => m._id === ctx.tempId);
          if (idx >= 0) {
            const next = [...curr];
            next[idx] = serverMessage;
            return next;
          }
          return curr.concat(serverMessage);
        }
      );
    },

    onSettled: (_data, _err, vars) => {
      // optional: refetch to guarantee consistency
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(vars.receiverId),
      });
    },
  });
}

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
};

export function useSubscribeToMessages() {
  const { socket } = useSocket();
  const qc = useQueryClient();
  const [isTyping, setIsTyping] = useState(false)
  const [isStopTyping, setIsStopTyping] = useState(false)

  const { value: selectedUser, hydrated } = useLocalStorage<any | null>(
    "chat.selectedUser",
    null
  );

  useEffect(() => {
    console.log("SUBSCRIBE EFFECT", {
      hydrated,
      hasSocket: !!socket,
      socketConnected: socket?.connected,
      selectedUser,
      selectedUserId: selectedUser?._id,
    });

    if (!hydrated) return;
    if (!socket) return;

    const selectedUserId = selectedUser?._id;
    if (!selectedUserId) return;

    const handler = (newMessage: Message) => {
      console.log("newMessage event fired:", newMessage);
      const isSoundEnabled =
        localStorage.getItem("chat.isSoundEnabled") !== "false";

      if (isSoundEnabled) {
        notificationSound.currentTime = 0;
        notificationSound
          .play()
          .catch((error) => console.log("Audio play failed:", error));
      }

      // ✅ better filter: accept both incoming and outgoing for this chat
      const isForThisChat =
        newMessage.senderId === selectedUserId ||
        newMessage.receiverId === selectedUserId;

      if (!isForThisChat) return;

      qc.setQueryData<Message[]>(
        chatKeys.messages(selectedUserId),
        (curr = []) => {
          if (curr.some((m) => m._id === newMessage._id)) return curr;
          return [...curr, newMessage];
        }
      );
    };

    console.log("Attaching newMessage listener for:", selectedUserId);

    socket.on("typing", ({ to }) => {
      setIsTyping(true)
    console.log("~~typing from", selectedUserId, "to", to, "socket", selectedUserId);
    })
    socket.on("stopTyping", ({ to }) => {
      // setIsTyping(false)
      setIsStopTyping(true)
    console.log("~~stopTyping", selectedUserId, "to", to, "socket", selectedUserId);
    })
    socket.on("newMessage", handler);

    return () => {
      console.log("Detaching newMessage listener for:", selectedUserId);
      socket.off("newMessage", handler);
    };
  }, [socket, hydrated, selectedUser?._id, qc]);
  return {isTyping, isStopTyping, selectedUser}
}
