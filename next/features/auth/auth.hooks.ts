import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  type AuthUser,
} from "./auth.api";
import { axiosInstance } from "@/lib/api";

export const AUTH_KEY = ["auth", "me"];

export function useAuthUser() {
    return useQuery({
      queryKey: ['auth', 'me'],
      queryFn: async () => {
        console.log('🚀 checkAuth queryFn running');
        console.log('axios baseURL', axiosInstance.defaults.baseURL);
        console.log('axios url', axiosInstance.getUri({ url: '/auth/check' }));
        const { data } = await axiosInstance.get('/auth/check');
        return data;
      },
      retry: false,
      refetchOnMount: 'always', // TEMP: for debugging
      staleTime: 0,
    });
}

export function useSignup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: signup,
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user);
      toast.success("Account created successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Signup failed");
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user);
      toast.success("Login successful");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Login failed");
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      qc.setQueryData(AUTH_KEY, null);
      toast.success("Logout successful");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Logout failed");
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      qc.setQueryData(AUTH_KEY, user);
      toast.success("Profile updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Update failed");
    },
  });
}