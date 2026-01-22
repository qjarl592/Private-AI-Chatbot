import { SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar'
import { useLocation } from '@tanstack/react-router'
import { type ReactNode } from 'react'
import { AppSidebar } from '../sidebar/AppSidebar'
import { ThemeToggle } from '../sidebar/ThemeToggle'

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  const location = useLocation()
  const isGuide = location.pathname === '/guide'

  if (isGuide) {
    return (
      <main className="w-screen bg-muted">
        <div className="sticky top-0 flex items-center justify-between bg-transparent">
          <ThemeToggle />
        </div>
        {children}
      </main>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-screen bg-muted">
        <div className="sticky top-0 flex items-center justify-between bg-muted">
          <SidebarTrigger />
          <ThemeToggle />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
