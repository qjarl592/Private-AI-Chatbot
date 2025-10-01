import type { OllamaModel } from "@/services/ollama";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ModelListStoreState {
  modelList: OllamaModel[];
  model: string;
}

interface ModelListStoreAction {
  setModelList: (newModelList: OllamaModel[]) => void;
  setModel: (model: string) => void;
  resetModelList: () => void;
}

type ModelListStore = ModelListStoreState & ModelListStoreAction;

const modelListInitialState: ModelListStoreState = {
  model: "",
  modelList: [],
};

export const useModelListStore = create<ModelListStore>()(
  persist(
    (set) => ({
      ...modelListInitialState,
      setModelList: (newModelList: OllamaModel[]) =>
        set({ modelList: newModelList }),
      setModel: (model) => set({ model }),
      resetModelList: () => set({ ...modelListInitialState }),
    }),
    {
      name: "ollama-model-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ model: state.model }),
    }
  )
);
