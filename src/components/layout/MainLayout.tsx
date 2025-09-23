import { useEffect, type ReactNode } from "react";
import { AppSidebar } from "../sidebar/AppSidebar";
import { useChatIdb } from "@/hooks/useChatIdb";
import { useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getStatus } from "@/services/ollama";
import { useModelListStore } from "@/store/modelListStore";
import { SidebarProvider, SidebarTrigger } from "@/components/shadcn/sidebar";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const location = useLocation();
  const { idbInstance } = useChatIdb();
  const setModelList = useModelListStore((state) => state.setModelList);

  const { data } = useQuery({
    queryKey: ["getStatus"],
    queryFn: getStatus,
  });

  useEffect(() => {
    if (!data) return;
    setModelList(data.models);
  }, [data, setModelList]);

  const isGuide = location.pathname === "/guide";

  return (
    <SidebarProvider>
      {!isGuide && idbInstance && <AppSidebar />}
      <main className="w-screen">
        {!isGuide && idbInstance && <SidebarTrigger />}
        {children}
      </main>
    </SidebarProvider>
  );
}
