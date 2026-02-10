import { useChatIdb } from '@/hooks/useChatIdb'
import { cn } from '@/lib/utils'
import { convertFilesToBase64, sendChatMessage } from '@/services/chat'
import type { ChatHistoryItem } from '@/services/idb'
import { getActiveRules, mergeRules } from '@/services/ruleService'
import { useIdbStore } from '@/store/IdbStore'
import { useChatStreamStore } from '@/store/chatStreamStore'
import { useImageUploadStore } from '@/store/imageUploadStore'
import { useModelListStore } from '@/store/modelListStore'
import { useSidebarStore } from '@/store/sidebarStore'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { CornerDownLeft } from 'lucide-react'
import { type KeyboardEvent, type Ref, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '../shadcn/button'
import { Card } from '../shadcn/card'
import { Textarea } from '../shadcn/textarea'

import { chatIdbQueryFactory } from '@/queries/chatIdb'
import { ImagePreviewList } from './ImagePreviewList'
import { ImageUploadButton } from './ImageUploadButton'
import ModelSelect from './ModelSelect'

interface Props {
  chatId?: string
  align: 'center' | 'bottom'
  onUpdateHeight?: () => void
  ref?: Ref<HTMLDivElement>
}

export default function InputBox({
  chatId,
  align,
  onUpdateHeight,
  ref,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { model } = useModelListStore()
  const { clearMsg, appendMsg, setIsFetching } = useChatStreamStore()
  const { startNewChat, logChatHistory, getChatHistory } = useChatIdb()
  const { images, clearImages } = useImageUploadStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { open } = useSidebarStore()
  const { idbInstance } = useIdbStore()

  const sendMsg = async (msg: string, chatId: string, imageFiles: File[]) => {
    if (!model) return

    try {
      clearMsg()
      setIsFetching(true)

      // ✅ 이미지를 base64로 변환
      let base64Images: string[] = []
      if (imageFiles.length > 0) {
        try {
          base64Images = await convertFilesToBase64(imageFiles)
        } catch (error) {
          console.error('Image conversion error:', error)
          toast.error('이미지 변환에 실패했습니다.')
          return
        }
      }

      // 이전 대화 기록
      const chatHistory = await getChatHistory(chatId)

      // 활성화된 규칙 가져오기 및 병합
      const activeRules = await getActiveRules(idbInstance)
      const mergedRules = mergeRules(activeRules)

      // ✅ 이미지가 있는 경우 images 필드 추가
      const historyItem: ChatHistoryItem = {
        model,
        role: 'user',
        content: msg,
        timestamp: new Date().toISOString(),
        ...(base64Images.length > 0 && { images: base64Images }),
      }
      await logChatHistory(chatId, historyItem)
      queryClient.invalidateQueries(chatIdbQueryFactory.chatHistory(chatId))

      // 채팅 메시지 전송
      const result = await sendChatMessage({
        model,
        content: msg,
        images: base64Images.length > 0 ? base64Images : undefined,
        chatHistory,
        onChunk: chunk => appendMsg(chunk),
        rules: mergedRules || undefined,
      })

      if (!result.success) {
        throw result.error || new Error('메시지 전송 실패')
      }

      const historyAnsItem: ChatHistoryItem = {
        model,
        role: 'assistant',
        content: result.fullResponse,
        timestamp: new Date().toISOString(),
      }
      await logChatHistory(chatId, historyAnsItem)
      queryClient.invalidateQueries(chatIdbQueryFactory.chatHistory(chatId))
    } catch (error) {
      console.error('Send message error:', error)
      toast.error('메시지 전송에 실패했습니다.')
    } finally {
      clearMsg()
      setIsFetching(false)
    }
  }

  const onClickSend = async () => {
    if (!textareaRef.current) return
    const msg = textareaRef.current.value.trim()
    if (msg.length === 0 && images.length === 0) return

    textareaRef.current.value = ''

    // ✅ 이미지 파일 배열 추출
    const imageFiles = images.map(img => img.file)

    const curChatId = chatId ?? (await startNewChat())
    if (!curChatId) return
    queryClient.invalidateQueries(chatIdbQueryFactory.chatIdList())

    // ✅ 이미지 파일 전달
    sendMsg(msg, curChatId, imageFiles)

    // ✅ 이미지 전송 후 클리어
    if (images.length > 0) {
      clearImages()
    }

    if (!chatId) {
      setTimeout(() => {
        navigate({ to: '/chat/$chatId', params: { chatId: curChatId } })
      }, 300)
    } else {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        })
      }, 300)
    }
  }

  const onEnter = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return
    if (e.code.toLocaleLowerCase() !== 'enter') return
    if (e.shiftKey) return
    e.preventDefault()
    onClickSend()
  }

  return (
    <Card
      ref={ref}
      className={cn(
        'fixed z-10 flex w-[calc(100%-192px)] max-w-[calc(64rem-192px)] flex-col gap-0 p-0',
        {
          'bottom-8': align === 'bottom',
          'bottom-1/2 translate-y-full': align === 'center',
          'w-[calc(100%-192px-16rem)]': open,
        }
      )}
    >
      <ImagePreviewList />
      <Textarea
        ref={textareaRef}
        placeholder="Type your message here."
        className="max-h-[40vh] resize-none border-t-0"
        onChange={onUpdateHeight}
        onKeyDown={onEnter}
      />
      <div className="flex w-full items-center justify-between">
        <ImageUploadButton />
        <div className="flex">
          <ModelSelect />
          <Button size="icon" variant="ghost" onClick={onClickSend}>
            <CornerDownLeft />
          </Button>
        </div>
      </div>
    </Card>
  )
}
