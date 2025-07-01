import { useChatIdb } from "@/hooks/useChatIdb";
import { useSuspenseQuery } from "@tanstack/react-query";
import ChatLink from "./ChatLink";

export default function Sidebar() {
  const { getAllChatId } = useChatIdb();

  const { data } = useSuspenseQuery({
    queryKey: ["getAllChatId", getAllChatId],
    queryFn: getAllChatId,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return (
    <div className="fixed top-0 left-0 z-10 h-screen w-64 shadow-lg">
      Sidebar
      <nav className="flex flex-col">
        <ChatLink title="new chate" />
        {data.map((chatInfo) => (
          <ChatLink
            key={`chat-${chatInfo.id}`}
            title={chatInfo.title}
            chatId={chatInfo.id}
          />
        ))}
      </nav>
    </div>
  );
}
