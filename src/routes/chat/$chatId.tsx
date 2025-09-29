import ChatContainer from "@/components/chat/ChatContainer";
import { useChatIdb } from "@/hooks/useChatIdb";
import { useIdbStore } from "@/store/IdbStore";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/$chatId")({
  component: Chat,
});

function Chat() {
  const { getAllChatId } = useChatIdb();
  const { chatId } = Route.useParams();
  const { idbInstance } = useIdbStore();

  const { data: isValidId, error } = useQuery({
    queryKey: ["getAllChatId"],
    queryFn: async () => {
      const allInfo = await getAllChatId();
      return !!allInfo.find((chatInfo) => chatInfo.id === chatId);
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    enabled: !!idbInstance,
  });

  if (isValidId) {
    return <ChatContainer chatId={chatId} />;
  }

  if (error || isValidId === false) {
    // alert 띄우기
    return <Navigate to="/chat" replace />;
  }
  return <>loading</>;
}
