import { create } from "zustand";

interface ChatStreamStoreState {
  done: boolean;
  chunkList: string[];
}

interface ChatStreamStoreAction {
  appendMsg: (chunk: string) => void;
  clearMsg: () => void;
}

const chatStreamInitialState: ChatStreamStoreState = {
  done: true,
  chunkList: [],
};

export const useChatStreamStore = create<
  ChatStreamStoreState & ChatStreamStoreAction
>((set, get) => ({
  ...chatStreamInitialState,
  appendMsg: (chunk: string) => {
    const { chunkList: prev } = get();
    set({ done: false, chunkList: [...prev, chunk] });
  },
  clearMsg: () => set({ ...chatStreamInitialState }),
}));
