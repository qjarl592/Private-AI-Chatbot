import { genUniqueId } from "@/lib/utils";
import {
  addItem,
  CHAT_STORE,
  deleteItem,
  getItem,
  IDB_ERRORS,
  META_STORE,
  updateItem,
  type ChatHistoryItem,
  type ChatInfoItem,
} from "@/services/idb";
import { useIdbStore } from "@/store/IdbStore";

import { useEffect } from "react";

const CHAT_ID_LIST_KEY = "chat_id";

export function useChatIdb() {
  const { idbInstance, init } = useIdbStore();

  useEffect(() => {
    if (!idbInstance) {
      init();
    }
  }, [idbInstance, init]);

  const getAllChatId = async () => {
    const allIdList = await getItem(idbInstance, META_STORE, CHAT_ID_LIST_KEY);
    return allIdList.value as ChatInfoItem[];
  };

  const getChatHistory = async (chatId: string) => {
    const history = await getItem(idbInstance, CHAT_STORE, chatId);
    return history.value as ChatHistoryItem[];
  };

  const startNewChat = async () => {
    // meta store 에 새로운 id 추가
    try {
      const chatInfoList = await getAllChatId();
      const chatIdList = chatInfoList.map((info) => info.id);
      const newId = genUniqueId(chatIdList);
      const newItem: ChatInfoItem = { id: newId, title: "(untitled)" };
      await updateItem(idbInstance, META_STORE, {
        key: CHAT_ID_LIST_KEY,
        value: [...chatInfoList, newItem],
      });
      await addItem(idbInstance, CHAT_STORE, { key: newId, value: [] });
      return newId;
    } catch (e) {
      if (!(e instanceof Error)) throw e;
      if (e.message !== IDB_ERRORS.ITEM_NOT_FOUND) throw e;
      const newId = genUniqueId([]);
      const newItem: ChatInfoItem = { id: newId, title: "(untitled)" };
      await addItem(idbInstance, META_STORE, {
        key: CHAT_ID_LIST_KEY,
        value: [newItem],
      });
      await addItem(idbInstance, CHAT_STORE, { key: newId, value: [] });
      return newId;
    }
  };

  const logChatHistory = async (
    chatId: string,
    historyItem: ChatHistoryItem
  ) => {
    const prevHistory = await getItem(idbInstance, CHAT_STORE, chatId);
    const prevHistoryValue = prevHistory.value as ChatHistoryItem[];
    await updateItem(idbInstance, CHAT_STORE, {
      key: chatId,
      value: [...prevHistoryValue, historyItem],
    });
  };

  const deleteChat = async (chatId: string) => {
    const allInfo = await getItem(idbInstance, META_STORE, CHAT_ID_LIST_KEY);
    const allInfoValue = allInfo.value as ChatInfoItem[];
    await updateItem(idbInstance, META_STORE, {
      key: CHAT_ID_LIST_KEY,
      value: allInfoValue.filter((info) => info.id !== chatId),
    });
    await deleteItem(idbInstance, CHAT_STORE, chatId);
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
