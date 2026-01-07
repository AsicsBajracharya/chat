// import axiosInstance from "@/lib/axios";

import { axiosInstance } from "@/lib/api";

export const chatApi = {
  getAllContacts: async () => {
    const res = await axiosInstance.get("/messages/contacts");
    return res.data;
  },

  getMyChatPartners: async () => {
    const res = await axiosInstance.get("/messages/chats");
    return res.data;
  },

  getMessagesByUserId: async (userId: string) => {
    const res = await axiosInstance.get(`/messages/${userId}`);
    return res.data;
  },

  sendMessage: async ({
    receiverId,
    messageData,
  }: {
    receiverId: string;
    messageData: { text?: string; image?: string };
  }) => {
    const res = await axiosInstance.post(
      `/messages/send/${receiverId}`,
      messageData
    );
    return res.data; // message created by server
  },
};
