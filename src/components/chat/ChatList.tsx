import { useChatIdb } from '@/hooks/useChatIdb'
import { useChatStreamStore } from '@/store/chatStreamStore'
import { useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import Loader from '../common/Loader'
import ChatItem from './ChatItem'

interface Props {
  chatId: string
}

export default function ChatList({ chatId }: Props) {
  const { idbInstance, getChatHistory } = useChatIdb()
  const { done, chunkList, isFetching } = useChatStreamStore()

  const { data } = useQuery({
    queryKey: ['getChatHistory', chatId],
    queryFn: () => getChatHistory(chatId),
    enabled: !!idbInstance,
  })

  const chatList = useMemo(() => {
    if (!data) return []
    return data.map((item, idx) => ({ ...item, id: idx }))
  }, [data])

  return (
    <div className="flex w-full flex-col gap-4 pb-48">
      {chatList?.map(item => (
        <ChatItem
          key={`chat-${chatId}-${item.id}`}
          side={item.role === 'user' ? 'right' : 'left'}
          images={item.images} // ✅ 이미지 데이터 전달
        >
          {item.content}
        </ChatItem>
      ))}
      {isFetching && done && <Loader />}
      {!done && <ChatItem side="left">{chunkList.join('')}</ChatItem>}
    </div>
  )
}
