import { Server } from "socket.io";
import http from "http";
import express from "express";
import 'dotenv/config'
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  console.log('map', userSocketMap)
  return userSocketMap[userId?.toString()];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.name);

  const userId = socket.user?._id || socket.userId;
  if (!userId) {
    console.log("❌ No userId on socket, disconnecting");
    socket.disconnect();
    return;
  }
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

   // ✅ Typing event (relay to receiver)
   socket.on("typing", ({ to }) => {
    const receiverId = to?.toString();
    if (!receiverId) return;

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      console.log(userId, 'is typing')
      io.to(receiverSocketId).emit("typing", { from: userId });
    }
  });

  // ✅ Stop typing event
  socket.on("stopTyping", ({ to }) => {
    const receiverId = to?.toString();
    if (!receiverId) return;

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", { from: userId });
    }
  });

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.name);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
