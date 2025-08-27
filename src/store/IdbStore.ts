import { initIdb, type IdbItem } from "@/services/idb";
import type { IDBPDatabase } from "idb";

import { create } from "zustand";

export type IdbStorage = "meta" | "chat";

interface IdbStoreState {
  idbInstance: IDBPDatabase<IdbItem> | null;
}

interface IdbStoreAction {
  init: () => Promise<void>;
}

export const useIdbStore = create<IdbStoreState & IdbStoreAction>(
  (set, get) => ({
    idbInstance: null,
    init: async () => {
      if (get().idbInstance) return;
      const idb = await initIdb();
      set({ idbInstance: idb });
    },
  })
);
