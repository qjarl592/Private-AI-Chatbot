import { useChatIdb } from '@/hooks/useChatIdb'
import { IDB_ERRORS } from '@/services/idb'
import { useIdbStore } from '@/store/IdbStore'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import ChatLink from './ChatLink'

export default function ChatLinkList() {
  const { getAllChatId } = useChatIdb()
  const { idbInstance } = useIdbStore()

  const [isEditing, setIsEditing] = useState<null | string>(null)

  const { data } = useSuspenseQuery({
    queryKey: ['getAllChatId', getAllChatId],
    queryFn: async () => {
      if (!idbInstance) return []
      try {
        return await getAllChatId()
      } catch (e) {
        if (e instanceof Error && e.message === IDB_ERRORS.ITEM_NOT_FOUND) {
          return []
        }
        throw e
      }
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: false,
  })

  const onChangeEdit = (value: string | null) => {
    setIsEditing(value)
  }

  return (
    <>
      {data.map(chatInfo => (
        <ChatLink
          key={`chat-${chatInfo.id}`}
          title={chatInfo.title}
          chatId={chatInfo.id}
          isEditing={chatInfo.id === isEditing}
          onChangeEdit={onChangeEdit}
        />
      ))}
    </>
  )
}
