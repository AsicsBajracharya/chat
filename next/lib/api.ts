import axios from "axios";

export const axiosInstance  = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // e.g. https://api.example.com
  withCredentials: true, // ✅ sends cookies
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});


