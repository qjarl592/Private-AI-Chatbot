import { Info, MessageCirclePlus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../shadcn/sidebar";
import { Link } from "@tanstack/react-router";
import ChatLinkList from "./ChatLinkList";
import OllamaSetting from "./OllamaSetting";
import { useEffect } from "react";
import { useSidebarStore } from "@/store/sidebarStore";

export function AppSidebar() {
  const { open } = useSidebar();
  const { setOpen } = useSidebarStore();

  useEffect(() => {
    setOpen(open);
  }, [open, setOpen]);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="font-bold text-xl">Ollama AI Chat</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-9">
                  <Link to="/chat">
                    <MessageCirclePlus />
                    <span>new chat</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton asChild className="h-9">
                  <Link to="/guide">
                    <Info />
                    <span>Guide</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <ChatLinkList />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <OllamaSetting />
      </SidebarFooter>
    </Sidebar>
  );
}
