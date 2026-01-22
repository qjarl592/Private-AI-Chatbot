import type { ChatHistoryItem, ChatInfoItem } from '@/services/idb'
import { queryOptions } from '@tanstack/react-query'

export const chatIdbQueryFactory = {
  all: () => ['chatIdb'],
  chatIdList: () =>
    queryOptions<ChatInfoItem[]>({
      queryKey: [...chatIdbQueryFactory.all(), 'chatId', 'list'],
      retry: false,
    }),
  chatHistory: (chatId: string) =>
    queryOptions<ChatHistoryItem[]>({
      queryKey: [...chatIdbQueryFactory.all(), 'chatHistory', chatId],
      retry: false,
    }),
}
