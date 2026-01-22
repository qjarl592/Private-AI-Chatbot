import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ModelListStoreState {
  model: string | null
}

interface ModelListStoreAction {
  setModel: (model: string) => void
}

type ModelListStore = ModelListStoreState & ModelListStoreAction

const modelListInitialState: ModelListStoreState = {
  model: null,
}

export const useModelListStore = create<ModelListStore>()(
  persist(
    set => ({
      ...modelListInitialState,
      setModel: model => set({ model }),
    }),
    {
      name: 'ollama-model-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ model: state.model }),
    }
  )
)
