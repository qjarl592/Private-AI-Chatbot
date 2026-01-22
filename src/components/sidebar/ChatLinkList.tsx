import { useChatIdb } from '@/hooks/useChatIdb'
import { chatIdbQueryFactory } from '@/queries/chatIdb'
import { type ChatInfoItem } from '@/services/idb'
import { useIdbStore } from '@/store/IdbStore'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Loader from '../common/Loader'
import Optional from '../common/Optional'
import UseSuspenseQuery from '../common/UseSuspenseQuery'
import ChatLink from './ChatLink'

export default function ChatLinkList() {
  const { getAllChatId } = useChatIdb()
  const { idbInstance } = useIdbStore()

  const [isEditing, setIsEditing] = useState<null | string>(null)

  const onChangeEdit = (value: string | null) => {
    setIsEditing(value)
  }

  return (
    <Optional option={!!idbInstance}>
      <ErrorBoundary fallback={<div>Error loading chat history</div>}>
        <Suspense fallback={<Loader />}>
          <UseSuspenseQuery<ChatInfoItem[]>
            queryFn={getAllChatId}
            {...chatIdbQueryFactory.chatIdList()}
          >
            {({ data }) => (
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
            )}
          </UseSuspenseQuery>
        </Suspense>
      </ErrorBoundary>
    </Optional>
  )
}
