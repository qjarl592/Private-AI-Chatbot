import { useRef } from 'react'
import Optional from '../common/Optional'
import ChatList from './ChatList'
import InputBox from './InputBox'

interface Props {
  chatId?: string
}

export default function ChatContainer({ chatId }: Props) {
  const inputBoxRef = useRef<HTMLDivElement>(null)

  return (
    <div className="mx-auto min-h-screen max-w-5xl overflow-x-hidden bg-muted">
      <div className="w-full px-24 pt-16">
        <Optional option={!!chatId}>
          <ChatList chatId={chatId!} />
        </Optional>
        <InputBox chatId={chatId} ref={inputBoxRef} align="bottom" />
        <div className="fixed bottom-0 left-0 h-36 w-full bg-muted" />
      </div>
    </div>
  )
}
