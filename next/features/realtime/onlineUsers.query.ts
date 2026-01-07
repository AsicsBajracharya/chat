// features/realtime/onlineUsers.query.ts
"use client";

import { useQuery } from "@tanstack/react-query";

export const onlineUsersKey = ["realtime", "onlineUsers"] as const;

export function useOnlineUsers() {
  return useQuery<string[]>({
    queryKey: onlineUsersKey,
    queryFn: async () => [], // default if nothing in cache
    staleTime: Infinity,
  });
}
