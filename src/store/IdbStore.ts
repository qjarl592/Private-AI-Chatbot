import type { ChatItem } from "@/services/ollama";
import { openDB, type IDBPDatabase } from "idb";
import { create } from "zustand";

export interface ChatHistoryItem extends ChatItem {
  model?: string;
}

export interface ChatInfo {
  id: string;
  title: string;
}

export interface IdbItem {
  key: string;
  value: ChatHistoryItem[] | ChatInfo[];
}

export type IdbStorage = "meta" | "chat";

interface IdbStoreState {
  idbInstance: IDBPDatabase<IdbItem> | null;
}

interface IdbStoreAction {
  initIdb: () => Promise<void>;
  addItem: (storage: IdbStorage, item: IdbItem) => Promise<IDBValidKey>;
  getItem: (storage: IdbStorage, key: string) => Promise<IdbItem>;
  getAllItem: (Storage: IdbStorage) => Promise<IdbItem[]>;
  updateItem: (storage: IdbStorage, item: IdbItem) => Promise<IDBValidKey>;
  deleteItem: (storage: IdbStorage, key: string) => Promise<void>;
  clearStorage: (storage: IdbStorage) => Promise<void>;
}

const DB_NAME = "private-ai-chat-db";
const DB_VERSION = 1;
export const META_STORE = "meta";
export const CHAT_STORE = "chat";
export const IDB_ERRORS = {
  NOT_INITIALIZED: "IDB instance is not initialized.",
  STORAGE_NOT_EXIST: "IDB storage does not exist.",
  ITEM_NOT_FOUND: "Item not found.",
} as const;

export const useIdbStore = create<IdbStoreState & IdbStoreAction>(
  (set, get) => ({
    idbInstance: null,
    initIdb: async () => {
      if (get().idbInstance) return;

      const idb = await openDB<IdbItem>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(META_STORE)) {
            db.createObjectStore(META_STORE, { keyPath: "key" });
          }
          if (!db.objectStoreNames.contains(CHAT_STORE)) {
            db.createObjectStore(CHAT_STORE, { keyPath: "key" });
          }
        },
      });
      set({ idbInstance: idb });
    },
    addItem: async (storage: IdbStorage, item: IdbItem) => {
      const { idbInstance } = get();
      const validIdb = validateAll(idbInstance, storage);
      const tx = validIdb.transaction(storage, "readwrite");
      const store = tx.objectStore(storage);
      const res = await store.add(item);
      await tx.done;
      return res;
    },
    getItem: async (storage: IdbStorage, key: string) => {
      const { idbInstance } = get();
      const validIdb = validateAll(idbInstance, storage);
      const res = (await validIdb.get(storage, key)) as IdbItem | undefined;
      if (res === undefined) throw new Error(IDB_ERRORS.ITEM_NOT_FOUND);
      return res;
    },
    getAllItem: async (storage: IdbStorage) => {
      const { idbInstance } = get();
      const validIdb = validateAll(idbInstance, storage);
      const res = (await validIdb.getAll(storage)) as IdbItem[];
      return res;
    },
    updateItem: async (storage: IdbStorage, item: IdbItem) => {
      const { idbInstance } = get();
      const validIdb = validateAll(idbInstance, storage);
      const tx = validIdb.transaction(storage, "readwrite");
      const store = tx.objectStore(storage);
      const res = await store.put(item);
      await tx.done;
      return res;
    },
    deleteItem: async (storage: IdbStorage, key: string) => {
      const { idbInstance } = get();
      const validIdb = validateAll(idbInstance, storage);
      const tx = validIdb.transaction(storage, "readwrite");
      const store = tx.objectStore(storage);
      await store.delete(key);
      await tx.done;
    },
    clearStorage: async (storage: IdbStorage) => {
      const { idbInstance } = get();
      const validIdb = validateAll(idbInstance, storage);
      const tx = validIdb.transaction(storage, "readwrite");
      const store = tx.objectStore(storage);
      await store.clear();
      await tx.done;
    },
  })
);

// 검증 헬퍼 함수들
const validateIdbInstance = (
  idbInstance: IDBPDatabase<IdbItem> | null
): IDBPDatabase<IdbItem> => {
  if (!idbInstance) throw new Error(IDB_ERRORS.NOT_INITIALIZED);
  return idbInstance;
};

const validateStorage = (
  idbInstance: IDBPDatabase<IdbItem>,
  storage: IdbStorage
): void => {
  if (!idbInstance.objectStoreNames.contains(storage)) {
    throw new Error(IDB_ERRORS.STORAGE_NOT_EXIST);
  }
};

// 통합 검증 함수
const validateAll = (
  idbInstance: IDBPDatabase<IdbItem> | null,
  storage: IdbStorage
): IDBPDatabase<IdbItem> => {
  const validIdb = validateIdbInstance(idbInstance);
  validateStorage(validIdb, storage);
  return validIdb;
};
