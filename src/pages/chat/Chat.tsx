import ChatContainer from "@/components/chat/ChatContainer";
import { useLocation } from "react-router-dom";

export default function Chat() {
  const { pathname } = useLocation();
  const pathList = pathname.split("/").filter((p) => p.length > 0);
  const chatId = pathList.at(-1);

  return <ChatContainer chatId={chatId} />;
}
