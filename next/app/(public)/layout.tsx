"use client";

import { useAuthUser } from "@/features/auth/auth.hooks";
// import { useAuthUser } from "@/hooks/useAuthUser";
import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useAuthUser();

  if (isLoading) {
    return null; // or spinner
  }

  if (user) {
    redirect("/");
  }

  return <>{children}</>

}