import { genUniqueId } from "@/lib/utils";
import {
  CHAT_STORE,
  IDB_ERRORS,
  META_STORE,
  useIdbStore,
  type ChatHistoryItem,
  type ChatInfo,
} from "@/store/IdbStore";
import { useCallback, useEffect } from "react";

const CHAT_ID_LIST_KEY = "chat_id";

export function useChatIdb() {
  const { idbInstance, initIdb, addItem, getItem, updateItem, deleteItem } =
    useIdbStore();

  useEffect(() => {
    initIdb();
  }, [initIdb]);

  const checkIsInit = useCallback(() => {
    return !!idbInstance;
  }, [idbInstance]);

  const getAllChatId = useCallback(async () => {
    const allIdList = await getItem(META_STORE, CHAT_ID_LIST_KEY);
    return allIdList.value as ChatInfo[];
  }, [getItem]);

  const getChatHistory = useCallback(
    async (chatId: string) => {
      const history = await getItem(CHAT_STORE, chatId);
      return history.value as ChatHistoryItem[];
    },
    [getItem]
  );

  const startNewChat = useCallback(async () => {
    // meta store 에 새로운 id 추가
    try {
      const chatInfoList = await getAllChatId();
      const chatIdList = chatInfoList.map((info) => info.id);
      const newId = genUniqueId(chatIdList);
      const newItem: ChatInfo = { id: newId, title: "(untitled)" };
      await updateItem(META_STORE, {
        key: CHAT_ID_LIST_KEY,
        value: [...chatInfoList, newItem],
      });
      await addItem(CHAT_STORE, { key: newId, value: [] });
      return newId;
    } catch (e) {
      if (!(e instanceof Error)) throw e;
      if (e.message !== IDB_ERRORS.ITEM_NOT_FOUND) throw e;
      const newId = genUniqueId([]);
      const newItem: ChatInfo = { id: newId, title: "(untitled)" };
      await addItem(META_STORE, { key: CHAT_ID_LIST_KEY, value: [newItem] });
      await addItem(CHAT_STORE, { key: newId, value: [] });
      return newId;
    }
  }, [getAllChatId, addItem, updateItem]);

  const logChatHistory = useCallback(
    async (chatId: string, historyItem: ChatHistoryItem) => {
      const prevHistory = await getItem(CHAT_STORE, chatId);
      const prevHistoryValue = prevHistory.value as ChatHistoryItem[];
      await updateItem(CHAT_STORE, {
        key: chatId,
        value: [...prevHistoryValue, historyItem],
      });
    },
    [getItem, updateItem]
  );

  const deleteChat = useCallback(
    async (chatId: string) => {
      const allInfo = await getItem(META_STORE, CHAT_ID_LIST_KEY);
      const allInfoValue = allInfo.value as ChatInfo[];
      await updateItem(META_STORE, {
        key: CHAT_ID_LIST_KEY,
        value: allInfoValue.filter((info) => info.id !== chatId),
      });
      await deleteItem(CHAT_STORE, chatId);
    },
    [getItem, updateItem, deleteItem]
  );

  return {
    idbInstance,
    checkIsInit,
    getAllChatId,
    getChatHistory,
    startNewChat,
    logChatHistory,
    deleteChat,
  };
}
