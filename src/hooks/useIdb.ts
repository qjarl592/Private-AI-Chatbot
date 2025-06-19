import { genUniqueId } from "@/lib/utils";
import type { ChatItem } from "@/services/ollama";
import { useQuery } from "@tanstack/react-query";
import { openDB, type IDBPDatabase } from "idb";
import { useCallback } from "react";

const DB_NAME = "private-ai-chat-db";
const DB_VERSION = 1;
const META_STORE = "meta";
const CHAT_STORE = "chat";

export interface ChatHistoryItem extends ChatItem {
  model?: string;
}

export interface ChatInfo {
  id: string;
  title: string;
}

interface IdbItem {
  key: string;
  value: ChatHistoryItem[] | ChatInfo[];
}

const initIdb = async (): Promise<IDBPDatabase<IdbItem>> => {
  return await openDB<IdbItem>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains(CHAT_STORE)) {
        db.createObjectStore(CHAT_STORE, { keyPath: "key" });
      }
    },
  });
};

export function useIdb() {
  const { data: idbInstance } = useQuery({
    queryKey: ["indexeddb"],
    queryFn: initIdb,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  const addItem = useCallback(
    async (storage: string, item: IdbItem) => {
      if (!idbInstance) return;
      const tx = idbInstance.transaction(storage, "readwrite");
      const store = tx.objectStore(storage);
      await store.add(item);
      await tx.done;
    },
    [idbInstance]
  );

  const getItem = useCallback(
    async (storage: string, key: number | string) => {
      if (!idbInstance) return null;
      if (!idbInstance.objectStoreNames.contains(storage)) return null;
      return await idbInstance.get(storage, key);
    },
    [idbInstance]
  );

  // const getAllItems = async (storage: string) => {
  //   if (!idbInstance) return null;
  //   return await idbInstance.getAll(storage);
  // };

  const updateItem = useCallback(
    async (storage: string, item: IdbItem) => {
      if (!idbInstance) return;
      const tx = idbInstance.transaction(storage, "readwrite");
      const store = tx.objectStore(storage);
      await store.put(item);
      await tx.done;
    },
    [idbInstance]
  );

  const deleteItem = async (storage: string, key: string) => {
    if (!idbInstance) return;
    const tx = idbInstance.transaction(storage, "readwrite");
    const store = tx.objectStore(storage);
    await store.delete(key);
    await tx.done;
  };

  const getAllChatId = useCallback(async () => {
    const chatIdListKey = "chat_id";
    const allIdList = await getItem(META_STORE, chatIdListKey);
    if (allIdList) {
      return allIdList;
    }
    throw new Error("cannot find chat logs");
  }, [getItem]);

  const getChatHistory = async (chatId: string) => {
    const history = await getItem(CHAT_STORE, chatId);
    if (history.value) {
      return history.value as ChatHistoryItem[];
    }
    throw new Error("cannot find history");
  };

  const startNewChat = async () => {
    // meta store 에 새로운 id 추가
    const chatIdListKey = "chat_id";
    const idList = await getItem(META_STORE, chatIdListKey);
    const newId = genUniqueId(idList ? idList.value : []);
    const newItem = { id: newId, title: "(untitled)" };
    if (!idList) {
      await addItem(META_STORE, { key: chatIdListKey, value: [newItem] });
    } else {
      await updateItem(META_STORE, {
        key: chatIdListKey,
        value: [...idList.value, newItem],
      });
    }

    // chat store 에 빈 history 추가
    await addItem(CHAT_STORE, { key: newId, value: [] });

    return newId;
  };

  const logChatHistory = async (
    chatId: string,
    historyItem: ChatHistoryItem
  ) => {
    const prevHistory = await getItem(CHAT_STORE, chatId);
    await updateItem(CHAT_STORE, {
      key: chatId,
      value: [...prevHistory.value, historyItem],
    });
  };

  const deleteChat = async (chatId: string) => {
    const chatIdListKey = "chat_id";
    const idList = await getItem(META_STORE, chatIdListKey);
    await updateItem(META_STORE, {
      key: chatIdListKey,
      value: idList.value.filter((id: string) => id !== chatId),
    });
    await deleteItem(CHAT_STORE, chatId);
  };

  return {
    idbInstance,
    getAllChatId,
    getChatHistory,
    startNewChat,
    logChatHistory,
    deleteChat,
  };
}
