import { create } from 'zustand'

type OnConfirmHandler = (
  props: Omit<ConfirmStoreState, 'isOpen' | 'resolver'> & {
    onConfirm: () => Promise<unknown> | unknown
    onCancel?: () => Promise<unknown> | unknown
  }
) => Promise<boolean>

interface ConfirmStoreState {
  isOpen: boolean
  title: string
  description: string
  actionText: string
  cancelText?: string
  resolver: (isConfirm: boolean) => void
}

interface ConfirmStoreAction {
  requestConfirm: OnConfirmHandler
}

const defaultConfirmState: ConfirmStoreState = {
  isOpen: false,
  title: '',
  description: '',
  actionText: '',
  cancelText: '',
  resolver: () => {},
}

const useConfirmStore = create<ConfirmStoreState & ConfirmStoreAction>(set => ({
  ...defaultConfirmState,
  requestConfirm: async ({ onCancel, onConfirm, ...props }) => {
    set({ isOpen: true, ...props })
    const isConfirm = await new Promise<boolean>(resolve => {
      set({ resolver: resolve })
    })
    set({ isOpen: false })
    if (isConfirm) {
      await onConfirm()
    }
    if (onCancel) {
      await onCancel()
    }
    return isConfirm
  },
}))

export const useConfirm = () => {
  const { isOpen, requestConfirm } = useConfirmStore()
  return { isOpen, requestConfirm }
}

export const useConfirmProvider = () => {
  return useConfirmStore()
}
