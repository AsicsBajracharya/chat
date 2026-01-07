"use client"
import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthUser } from "../auth/auth.hooks";
import { useQueryClient } from "@tanstack/react-query";
import { onlineUsersKey } from "@/features/realtime/onlineUsers.query";

type SocketCtx = {
  socket: Socket | null;
  onlineUsers: string[];
};

const SocketContext = React.createContext<SocketCtx>({
  socket: null,
  onlineUsers: [],
});


const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001" ;

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: authUser } = useAuthUser();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const qc = useQueryClient();
  const [onlineUsers, setOnlineUsers] = React.useState<string[]>([]);

  React.useEffect(() => {
    // ✅ If not logged in, ensure socket is disconnected
    if (!authUser) {
      if (socket?.connected) socket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
      qc.setQueryData<string[]>(onlineUsersKey, []);
      return;
    }

    // ✅ If already connected, do nothing
    if (socket?.connected) return;

    const s = io(SOCKET_URL, {
      withCredentials: true, // ✅ send cookies on handshake
      transports: ["websocket"],
    });

    s.connect();
    setSocket(s);

    s.on("getOnlineUsers", (userIds: string[]) => {
      qc.setQueryData<string[]>(onlineUsersKey, userIds);
      setOnlineUsers(userIds);
    });

    return () => {
      s.off("getOnlineUsers");
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );

}

export function useSocket() {
  return React.useContext(SocketContext);
}

  