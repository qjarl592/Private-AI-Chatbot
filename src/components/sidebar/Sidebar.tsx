import { useChatIdb } from "@/hooks/useChatIdb";
import { useSuspenseQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

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
        <NavLink to="/chat/new">new chat</NavLink>
        {data.map((chatInfo) => (
          <NavLink
            key={`chat-${chatInfo.id}`}
            className="max-w-64 overflow-hidden text-ellipsis border border-black"
            to={chatInfo.id}
          >
            {chatInfo.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
