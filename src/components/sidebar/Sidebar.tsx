import { useChatIdb } from "@/hooks/useChatIdb";
import { useSuspenseQuery } from "@tanstack/react-query";
import ChatLink from "./ChatLink";
import { useState } from "react";

export default function Sidebar() {
  const [isSomeOpen, setIsSomeOpen] = useState(false);
  const { getAllChatId } = useChatIdb();

  const { data } = useSuspenseQuery({
    queryKey: ["getAllChatId", getAllChatId],
    queryFn: getAllChatId,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  console.log("isO", isSomeOpen);

  return (
    <div className="fixed top-0 left-0 z-10 h-screen w-64 shadow-lg">
      Sidebar
      <nav className="flex flex-col">
        <ChatLink
          title="new chate"
          isSomeOpen={isSomeOpen}
          onOpen={() => setIsSomeOpen(true)}
          onClose={() => setIsSomeOpen(false)}
        />
        {data.map((chatInfo) => (
          <ChatLink
            key={`chat-${chatInfo.id}`}
            title={chatInfo.title}
            chatId={chatInfo.id}
            isSomeOpen={isSomeOpen}
            onOpen={() => setIsSomeOpen(true)}
            onClose={() => setIsSomeOpen(false)}
          />
        ))}
      </nav>
    </div>
  );
}
