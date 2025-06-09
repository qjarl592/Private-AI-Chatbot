import type { OllamaModel } from "@/services/ollama";
import { create } from "zustand";

interface ModelListStoreState {
  modelList: OllamaModel[];
}

interface ModelListStoreAction {
  setModelList: (newModelList: OllamaModel[]) => void;
  resetModelList: () => void;
}

const modelListInitialState: ModelListStoreState = {
  modelList: [],
};

export const useModelListStore = create<
  ModelListStoreState & ModelListStoreAction
>((set) => ({
  ...modelListInitialState,
  setModelList: (newModelList: OllamaModel[]) =>
    set({ modelList: newModelList }),
  resetModelList: () => set({ ...modelListInitialState }),
}));
