import { type ReactNode } from "react";
import { AppSidebar } from "../sidebar/AppSidebar";
import { useChatIdb } from "@/hooks/useChatIdb";
import { useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getStatus } from "@/services/ollama";
import { useModelListStore } from "@/store/modelListStore";
import { SidebarProvider, SidebarTrigger } from "@/components/shadcn/sidebar";
import { ThemeToggle } from "../sidebar/ThemeToggle";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const location = useLocation();
  const { idbInstance } = useChatIdb();
  const { setModelList, model, setModel } = useModelListStore();

  useQuery({
    queryKey: ["getStatus"],
    queryFn: async () => {
      const data = await getStatus();
      if (data.models.length > 0) {
        setModelList(data.models);
        if (model === "") {
          setModel(data.models[0].model);
        }
      }
      return data;
    },
  });

  const isGuide = location.pathname === "/guide";

  return (
    <SidebarProvider>
      {!isGuide && idbInstance && <AppSidebar />}
      <main className="w-screen bg-muted">
        <div
          className={cn("sticky top-0 flex items-center justify-between", {
            "bg-transparent": isGuide,
          })}
        >
          {!isGuide && idbInstance && <SidebarTrigger />}
          <ThemeToggle />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
