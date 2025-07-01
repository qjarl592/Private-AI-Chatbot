import { useChatIdb } from "@/hooks/useChatIdb";
import ChatItem from "./ChatItem";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useChatStreamStore } from "@/store/chatStreamStore";

interface Props {
  chatId: string;
}

export default function ChatList({ chatId }: Props) {
  const { idbInstance, getChatHistory } = useChatIdb();
  const { done, chunkList } = useChatStreamStore();

  const { data } = useQuery({
    queryKey: ["getChatHistory", chatId, done],
    queryFn: () => getChatHistory(chatId),
    enabled: !!idbInstance && done,
  });

  const chatList = useMemo(() => {
    if (!data) return [];
    return data.map((item, idx) => ({ ...item, id: idx }));
  }, [data]);

  console.log("chunks", chunkList, data);

  return (
    <div className="flex w-full flex-col gap-4">
      {chatList?.map((item) => (
        <ChatItem
          key={`chat-${chatId}-${item.id}`}
          side={item.role === "user" ? "right" : "left"}
        >
          {item.content}
        </ChatItem>
      ))}
      {!done && <ChatItem side="left">{chunkList.join("")}</ChatItem>}
    </div>
  );
}
