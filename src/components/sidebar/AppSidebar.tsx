import { useSidebarStore } from '@/store/sidebarStore'
import { Link } from '@tanstack/react-router'
import { FilePlusCorner, Info, MessageCirclePlus } from 'lucide-react'
import { useEffect } from 'react'
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
} from '../shadcn/sidebar'
import ChatLinkList from './ChatLinkList'
import OllamaSetting from './OllamaSetting'

export function AppSidebar() {
  const { open } = useSidebar()
  const { setOpen } = useSidebarStore()

  useEffect(() => {
    // zustand store 와 상태 싱크
    setOpen(open)
  }, [open, setOpen])

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="font-bold text-xl">Ollama AI Chat</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarCommonMenuList />
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarChatHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <OllamaSetting />
      </SidebarFooter>
    </Sidebar>
  )
}

const SidebarCommonMenuList = () => {
  return (
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="h-9">
            <Link to="/chat">
              <MessageCirclePlus />
              <span>New Chat</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild className="h-9">
            <Link to="/guide">
              <Info />
              <span>Guide</span>
            </Link>
          </SidebarMenuButton>

          <SidebarMenuButton asChild className="h-9">
            <Link to="/rules">
              <FilePlusCorner />
              Rules
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  )
}

const SidebarChatHistory = () => {
  return (
    <SidebarGroupContent>
      <SidebarMenu>
        <ChatLinkList />
      </SidebarMenu>
    </SidebarGroupContent>
  )
}
