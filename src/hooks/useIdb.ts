import { genUniqueId } from "@/lib/utils";
import type { ChatItem } from "@/services/ollama";
import { openDB, type IDBPDatabase } from "idb";
import { useEffect, useRef } from "react";

const DB_NAME = "private-ai-chat-db";
const DB_VERSION = 1;
const META_STORE = "meta";
const CHAT_STORE = "chat";

interface ChatHistoryItem extends ChatItem {
  model?: string;
}

interface IdbItem {
  key: string;
  value: ChatHistoryItem[] | string[];
}

export function useIdb() {
  const idbRef = useRef<IDBPDatabase<IdbItem> | null>(null);
  const idbInstance = idbRef.current;

  useEffect(() => {
    const initIdb = async () => {
      const idb = await openDB<IdbItem>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(META_STORE)) {
            db.createObjectStore(META_STORE, {
              keyPath: "key",
            });
          }
          if (!db.objectStoreNames.contains(CHAT_STORE)) {
            db.createObjectStore(CHAT_STORE, {
              keyPath: "key",
            });
          }
        },
      });
      idbRef.current = idb;
    };
    initIdb();
  }, []);

  const addItem = async (storage: string, item: IdbItem) => {
    if (!idbInstance) return;
    const tx = idbInstance.transaction(storage, "readwrite");
    const store = tx.objectStore(storage);
    await store.add(item);
    await tx.done;
  };

  const getItem = async (storage: string, key: number | string) => {
    if (!idbInstance) return null;
    if (!idbInstance.objectStoreNames.contains(storage)) return null;
    return await idbInstance.get(storage, key);
  };

  const getAllItems = async (storage: string) => {
    if (!idbInstance) return null;
    return await idbInstance.getAll(storage);
  };

  const updateItem = async (storage: string, item: IdbItem) => {
    if (!idbInstance) return;
    const tx = idbInstance.transaction(storage, "readwrite");
    const store = tx.objectStore(storage);
    await store.put(item);
    await tx.done;
  };

  const deleteItem = async (storage: string, key: string) => {
    if (!idbInstance) return;
    const tx = idbInstance.transaction(storage, "readwrite");
    const store = tx.objectStore(storage);
    await store.delete(key);
    await tx.done;
  };

  const getAllChatId = async () => {
    const allIdList = await getAllItems(META_STORE);
    return allIdList;
  };

  const getChatHistory = async (chatId: string) => {
    const history = await getItem(CHAT_STORE, chatId);
    return history;
  };

  const startNewChat = async () => {
    // meta store 에 새로운 id 추가
    const chatIdListKey = "chat_id";
    const idList = await getItem(META_STORE, chatIdListKey);
    const newId = genUniqueId(idList === null ? [] : idList.value);
    if (idList === null) {
      await addItem(META_STORE, { key: chatIdListKey, value: [newId] });
    } else {
      await updateItem(META_STORE, {
        key: chatIdListKey,
        value: [...idList.value, newId],
      });
    }

    // chat store 에 빈 history 추가
    await addItem(CHAT_STORE, { key: newId, value: [] });
  };

  const logChatHistory = async (
    chatId: string,
    historyItem: ChatHistoryItem
  ) => {
    const prevHistory = await getItem(CHAT_STORE, chatId);
    await updateItem(META_STORE, {
      key: chatId,
      value: [prevHistory, historyItem],
    });
  };

  const deleteChat = async (chatId: string) => {
    const chatIdListKey = "chat_id";
    const idList = await getItem(META_STORE, chatIdListKey);
    await updateItem(META_STORE, {
      key: chatIdListKey,
      value: [idList.value.filter((id: string) => id !== chatId)],
    });
    await deleteItem(CHAT_STORE, chatId);
  };

  return {
    getAllChatId,
    getChatHistory,
    startNewChat,
    logChatHistory,
    deleteChat,
  };
}
