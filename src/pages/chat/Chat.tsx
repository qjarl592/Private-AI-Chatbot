import ChatContainer from "@/components/chat/ChatContainer";
import { useChatIdb } from "@/hooks/useChatIdb";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";

export default function Chat() {
  const { getAllChatId } = useChatIdb();
  const { chatId } = useParams();

  const { data: isValidId, error } = useQuery({
    queryKey: ["getAllChatId"],
    queryFn: async () => {
      const allInfo = await getAllChatId();
      return !!allInfo.find((chatInfo) => chatInfo.id === chatId);
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
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
