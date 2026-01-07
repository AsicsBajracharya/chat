"use client"

import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import { useSendMessage, useSubscribeToMessages } from "@/features/chat/chat.hooks";
import { useAuthUser } from "@/features/auth/auth.hooks";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSocket } from "@/features/socket/socketProvider";
// import { debounce } from "lodash";

interface MessageInputProps {
  setisChangeInView?:(val:boolean) => void;
}
const MessageInput = ({setisChangeInView}: MessageInputProps) => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null); // to scroll the bottom when the user selects an immage
  const {mutate:sendMessage, isPending} = useSendMessage();
  const{data:sender, isLoading} = useAuthUser()
  const { value: receiver, hydrated } = useLocalStorage<any | null>(
    "chat.selectedUser",
    null
  );
  const {isTyping} = useSubscribeToMessages()
  const [isUserTyping, setUserIsTyping] = useState(false);
  const { socket } = useSocket();

  const isTypingRef = useRef(false);

  const fileInputRef = useRef(null);

  const receiverId = receiver?._id;
  const senderId = sender?._id;

  useEffect(() =>{
    console.log('~isTyping', isTyping)
  },[isTyping])

  useEffect(() => {
    // if text is empty, user is not typing
    if (!text) {
      setUserIsTyping(false);
      return;
    }

    // user is typing
    setUserIsTyping(true);

    // debounce: user stopped typing after 800ms
    const timeout = setTimeout(() => {
      setUserIsTyping(false);
      console.log("User stopped typing");
      if(socket && receiverId){
        socket.emit('stopTyping',{ to: receiverId })
      }
    }, 2000);

    // cleanup runs on next keystroke
    return () => clearTimeout(timeout);
  }, [text]);

  const handleSendMessage = (e:any) => {
    
    e.preventDefault();
    console.log('sender', sender, receiver)
    if (!text.trim() && !imagePreview) return;
    // if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
        receiverId,
        senderId,
        messageData:{
            text: text.trim(),
            image: imagePreview || '',
        }
      });
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      //   toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    if(setisChangeInView) setisChangeInView(true)
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() =>{
    if(text && socket && receiverId){
      setTimeout(() =>{

        socket.emit("typing", { to: receiverId });
      }, 800)
    }
  },[text])

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  return (
     <div className="p-4 border-t border-slate-700/50">
      {imagePreview && (
        <div className="max-w-full mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-blue-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center text-blue-200 hover:bg-blue-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="max-w-full mx-auto flex flex-wrap space-x-2 md:space-x-4 space-y-2">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
        
            // if (!socket || !receiverId) return;
        
            // // ✅ send "typing" once when user starts typing
            // if (!isTypingRef.current) {
            //   socket.emit("typing", { to: receiverId });
            //   isTypingRef.current = true;
            // }
        
            // // ✅ reset debounce timer for stopTyping
            // // if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        
            // typingTimeoutRef.current = setTimeout(() => {
            //   socket.emit("stopTyping", { to: receiverId });
            //   isTypingRef.current = false;
            // }, 800);
          }}
          onBlur={() => {
            // ✅ if user leaves input, stop typing immediately
            if (!socket || !receiverId) return;
        
            socket.emit("stopTyping", { to: receiverId });
            isTypingRef.current = false;
        
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }}
          className="flex-1 border border-slate-700/50 rounded-lg py-2 px-2"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={` text-slate-400 border border-slate-700/50 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="text-white rounded-lg px-4 py-2 font-medium bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed py-2"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>)
};

export default MessageInput;
