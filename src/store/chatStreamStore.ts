import { create } from 'zustand'

interface ChatStreamStoreState {
  done: boolean
  chunkList: string[]
  isFetching: boolean
}

interface ChatStreamStoreAction {
  appendMsg: (chunk: string) => void
  clearMsg: () => void
  setIsFetching: (isFetching: boolean) => void
}

const chatStreamInitialState: ChatStreamStoreState = {
  done: true,
  chunkList: [],
  isFetching: false,
}

export const useChatStreamStore = create<
  ChatStreamStoreState & ChatStreamStoreAction
>((set, get) => ({
  ...chatStreamInitialState,
  appendMsg: (chunk: string) => {
    const { chunkList: prev } = get()
    set({ done: false, chunkList: [...prev, chunk] })
  },
  clearMsg: () => set({ ...chatStreamInitialState }),
  setIsFetching: isFetching => set({ isFetching }),
}))
