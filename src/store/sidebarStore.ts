import { create } from 'zustand'

interface SidebarStoreState {
  open: boolean
}

interface SidebarStoreAction {
  setOpen: (open: boolean) => void
}

export const useSidebarStore = create<SidebarStoreState & SidebarStoreAction>()(
  set => ({
    open: true,
    setOpen: open => set({ open }),
  })
)
