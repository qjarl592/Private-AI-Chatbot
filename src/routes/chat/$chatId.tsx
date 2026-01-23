import ChatContainer from '@/components/chat/ChatContainer'
import Loader from '@/components/common/Loader'
import { useChatIdb } from '@/hooks/useChatIdb'
import { chatIdbQueryFactory } from '@/queries/chatIdb'
import { useIdbStore } from '@/store/IdbStore'
import { useQuery } from '@tanstack/react-query'
import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chat/$chatId')({
  component: Chat,
})

function Chat() {
  const { getAllChatId } = useChatIdb()
  const { chatId } = Route.useParams()
  const { idbInstance } = useIdbStore()

  const { data, isLoading } = useQuery({
    ...chatIdbQueryFactory.chatIdList(),
    queryFn: getAllChatId,
    enabled: !!idbInstance,
  })
  const isValidId = !!data?.find(chatInfo => chatInfo.id === chatId)

  if (!idbInstance || isLoading) {
    return <Loader />
  }

  if (!isValidId) {
    return <Navigate to="/chat" replace />
  }

  return <ChatContainer chatId={chatId} />
}
