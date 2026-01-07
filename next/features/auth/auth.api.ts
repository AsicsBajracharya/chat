import { axiosInstance } from "@/lib/api";

export type AuthUser = any; // replace with your type

export async function checkAuth(): Promise<AuthUser> {
  const { data } = await axiosInstance.get("/auth/check");
  return data;
}

export async function signup(data: any): Promise<AuthUser> {
  const res = await axiosInstance.post("/auth/signup", data);
  return res.data;
}

export async function login(data: any): Promise<AuthUser> {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
}

export async function logout(): Promise<any> {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
}

export async function updateProfile(data: any): Promise<AuthUser> {
  const res = await axiosInstance.put("/auth/update-profile", data);
  return res.data;
}
