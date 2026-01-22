import { useChatIdb } from '@/hooks/useChatIdb'
import { useChatStreamStore } from '@/store/chatStreamStore'

import { addIncrementalIds, range } from '@/lib/array'
import { chatIdbQueryFactory } from '@/queries/chatIdb'
import type { ChatHistoryItem } from '@/services/idb'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Loader from '../common/Loader'
import Optional from '../common/Optional'
import UseSuspenseQuery from '../common/UseSuspenseQuery'
import { ChatItem, ChatItemSkeleton } from './ChatItem'

interface Props {
  chatId: string
}

export default function ChatList({ chatId }: Props) {
  const { idbInstance, getChatHistory } = useChatIdb()
  const { done, chunkList, isFetching } = useChatStreamStore()

  if (idbInstance === null) {
    return <div>Initializing database...</div>
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div className="flex w-full flex-col gap-4 pb-48">
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
