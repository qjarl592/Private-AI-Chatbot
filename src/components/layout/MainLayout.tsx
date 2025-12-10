import { SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar'
import { useChatIdb } from '@/hooks/useChatIdb'
import { cn } from '@/lib/utils'
import { getStatus } from '@/services/ollama'
import { useModelListStore } from '@/store/modelListStore'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from '@tanstack/react-router'
import { type ReactNode } from 'react'
import { AppSidebar } from '../sidebar/AppSidebar'
import { ThemeToggle } from '../sidebar/ThemeToggle'

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  const location = useLocation()
  const { idbInstance } = useChatIdb()
  const { setModelList, model, setModel } = useModelListStore()

  const isGuide = location.pathname === '/guide'

  useQuery({
    queryKey: ['getStatus'],
    queryFn: async () => {
      const data = await getStatus()
      if (data.models.length > 0) {
        setModelList(data.models)
        if (
          model === '' &&
          data.models.find(item => item.model === model) === undefined
        ) {
          setModel(data.models[0].model)
        }
      }
      return data
    },
    enabled: !isGuide && !!idbInstance,
  })

  return (
    <SidebarProvider>
      {!isGuide && idbInstance && <AppSidebar />}
      <main className="w-screen bg-muted">
        <div
          className={cn(
            'sticky top-0 flex items-center justify-between bg-muted',
            {
              'bg-transparent': isGuide,
            }
          )}
        >
          {!isGuide && idbInstance && <SidebarTrigger />}
          <ThemeToggle />
        </div>
        {children}
      </main>
    </SidebarProvider>
  )
}
