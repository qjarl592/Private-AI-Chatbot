import { getStatus } from "@/services/ollama";
import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import Sidebar from "../sidebar/Sidebar";
import { useModelListStore } from "@/store/modelListStore";
import { useChatIdb } from "@/hooks/useChatIdb";
import { useLocation, useNavigate } from "@tanstack/react-router";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setModelList } = useModelListStore();
  const { idbInstance } = useChatIdb();

  const { data, isFetching, error } = useQuery({
    queryKey: ["getStatus"],
    queryFn: getStatus,
    enabled: location.pathname !== "/guide",
  });

  useEffect(() => {
    if (error) {
      navigate({ to: "/guide" });
    }
  }, [error, navigate]);

  useEffect(() => {
    if (!data) return;
    setModelList(data.models);
  }, [data, setModelList]);

  useEffect(() => {
    const pathList = location.pathname.split("/").filter((p) => p.length > 0);
    if (pathList.length === 1 && pathList[0] === "chat") {
      navigate({ to: "/chat" });
    }
  }, [location, navigate]);

  if (!data && isFetching) {
    return <div>loading...</div>;
  }

  if (data) {
    return (
      <>
        {idbInstance && <Sidebar />}
        <main className="w-screen">{children}</main>
      </>
    );
  }

  return <>{children}</>;
}
