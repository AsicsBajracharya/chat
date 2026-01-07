import { axiosInstance } from "@/lib/api";

export type AuthUser = any; 

export async function getAllContacts(): Promise<AuthUser> {
  const { data } = await axiosInstance.get("/auth/check");
  return data;
}