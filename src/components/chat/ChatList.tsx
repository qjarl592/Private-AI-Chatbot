import { useChatIdb } from '@/hooks/useChatIdb'
import { useChatStreamStore } from '@/store/chatStreamStore'

import { addIncrementalIds, range } from '@/lib/array'
import { chatIdbQueryFactory } from '@/queries/chatIdb'
import { sendChatMessage } from '@/services/chat'
import type { ChatHistoryItem } from '@/services/idb'
import { useModelListStore } from '@/store/modelListStore'
import { useQueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { toast } from 'sonner'
import Loader from '../common/Loader'
import Optional from '../common/Optional'
import UseSuspenseQuery from '../common/UseSuspenseQuery'
import { ChatItem, ChatItemSkeleton } from './ChatItem'

interface Props {
  chatId: string
}

export default function ChatList({ chatId }: Props) {
  const { idbInstance, getChatHistory, logChatHistory } = useChatIdb()
  const { done, chunkList, isFetching, appendMsg, clearMsg, setIsFetching } =
    useChatStreamStore()
  const { model } = useModelListStore()
  const queryClient = useQueryClient()

  if (idbInstance === null) {
    return <div>Initializing database...</div>
  }

  // 재시도 핸들러
  const handleRetry = async (content: string, images?: string[]) => {
    if (!model) {
      toast.error('모델을 선택해주세요.')
      return
    }

    try {
      clearMsg()
      setIsFetching(true)

      // 사용자 메시지를 히스토리에 추가
      const historyItem: ChatHistoryItem = {
        model,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        ...(images && images.length > 0 && { images }),
      }
      await logChatHistory(chatId, historyItem)
      queryClient.invalidateQueries(chatIdbQueryFactory.chatHistory(chatId))

      // 이전 대화 기록 가져오기
      const chatHistory = await getChatHistory(chatId)

      // 채팅 메시지 전송
      const result = await sendChatMessage({
        model,
        content,
        images,
        chatHistory,
        onChunk: chunk => appendMsg(chunk),
      })

      if (!result.success) {
        throw result.error || new Error('메시지 재전송 실패')
      }

      const historyAnsItem: ChatHistoryItem = {
        model,
        role: 'assistant',
        content: result.fullResponse,
        timestamp: new Date().toISOString(),
      }
      await logChatHistory(chatId, historyAnsItem)
      queryClient.invalidateQueries(chatIdbQueryFactory.chatHistory(chatId))

      toast.success('메시지를 재전송했습니다.')
    } catch (error) {
      console.error('Retry error:', error)
      toast.error('메시지 재전송에 실패했습니다.')
    } finally {
      clearMsg()
      setIsFetching(false)
    }
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="flex w-full flex-col gap-2 pb-48">
        <Suspense
          fallback={range(3).map(i => (
            <ChatItemSkeleton key={i} side={i % 2 ? 'left' : 'right'} />
          ))}
        >
          <UseSuspenseQuery<ChatHistoryItem[]>
            queryFn={() => getChatHistory(chatId)}
            {...chatIdbQueryFactory.chatHistory(chatId)}
          >
            {({ data: chatList }) => (
              <>
                {addIncrementalIds(chatList).map(item => (
                  <ChatItem
                    key={`chat-${chatId}-${item.id}`}
                    side={item.role === 'user' ? 'right' : 'left'}
                    images={item.images}
                    timestamp={item.timestamp}
                    content={item.content}
                    onRetry={item.role === 'user' ? handleRetry : undefined}
                  >
                    {item.content}
                  </ChatItem>
                ))}
              </>
            )}
          </UseSuspenseQuery>
        </Suspense>

        <Optional option={isFetching && done}>
          <Loader />
        </Optional>
        <Optional option={!done}>
          <ChatItem side="left">{chunkList.join('')}</ChatItem>
        </Optional>
      </div>
    </ErrorBoundary>
  )
}
