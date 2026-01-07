"use client";
import ContactCard from "@/app/ui/ContactCard";
import { useAllContacts } from "@/features/chat/chat.hooks";
import { useOnlineUsers } from "@/features/realtime/onlineUsers.query";
import { useSocket } from "@/features/socket/socketProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import React, { useEffect } from "react";

const ContactList = () => {
  const { data: allContacts, isLoading } = useAllContacts();
  const { value: selectedUser, setValue: setSelectedUser } = useLocalStorage(
    "chat.selectedUser",
    "chats"
  );

  //   const { data: onlineUsers = [] } = useOnlineUsers(); todo remove this hook
  const { onlineUsers } = useSocket();

  // useEffect(() => {
  //   console.log("contactData: allContacts", allContacts);
  //   console.log("isloading", isLoading);
  //   console.log("~isloadionlineUsersonlineUsersng", onlineUsers);
  // }, [allContacts, onlineUsers]);
  return (
    <>
      {allContacts?.map((contact: any) => (
        <ContactCard
        key={contact._id}
        contact={contact}
        onlineUsers={onlineUsers}
        onSelect={(setSelectedUser) as any}
      />
      ))}
    </>
  );
};

export default ContactList;
