import { useIdb, type ChatInfo } from "@/hooks/useChatIdb";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const { idbInstance, getAllChatId } = useIdb();

  const { data, isFetching } = useQuery({
    queryKey: ["getAllChatId", getAllChatId, idbInstance],
    queryFn: getAllChatId,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: false,
    enabled: !!idbInstance,
  });

  return (
    <div className="fixed top-0 left-0 z-10 h-screen w-64 shadow-lg">
      Sidebar
      <nav className="flex flex-col">
        <NavLink to="/chat/new">new chat</NavLink>
        {isFetching
          ? "loading..."
          : data?.value.map((chatId: ChatInfo) => (
              <NavLink
                key={`chat-${chatId.id}`}
                className="max-w-64 overflow-hidden text-ellipsis border border-black"
                to={chatId.id}
              >
                {chatId.title}
              </NavLink>
            ))}
      </nav>
    </div>
  );
}
