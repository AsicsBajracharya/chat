import ChatContainer from "@/components/chatContainer/ChatContainer";
import ChatHeader from "@/components/chatHeader/ChatHeader";

export default function Home() {
  return (
    <div className="h-[100%] items-center justify-center bg-zinc-50 font-san">
      <ChatHeader />
      <ChatContainer />
    </div>
  );
}
