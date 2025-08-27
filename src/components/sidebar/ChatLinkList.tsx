import { useSuspenseQuery } from "@tanstack/react-query";
import ChatLink from "./ChatLink";
import { useChatIdb } from "@/hooks/useChatIdb";
import { IDB_ERRORS } from "@/store/IdbStore";

export default function ChatLinkList() {
  const { getAllChatId } = useChatIdb();

  const { data } = useSuspenseQuery({
    queryKey: ["getAllChatId", getAllChatId],
    queryFn: async () => {
      try {
        return await getAllChatId();
      } catch (e) {
        if (e instanceof Error && e.message === IDB_ERRORS.ITEM_NOT_FOUND) {
          return [];
        }
        throw e;
      }
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
  return (
    <>
      {data.map((chatInfo) => (
        <ChatLink
          key={`chat-${chatInfo.id}`}
          title={chatInfo.title}
          chatId={chatInfo.id}
        />
      ))}
    </>
  );
}
