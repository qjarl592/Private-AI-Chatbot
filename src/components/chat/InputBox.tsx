import { useChatIdb } from '@/hooks/useChatIdb'
import { cn } from '@/lib/utils'
import type { ChatHistoryItem } from '@/services/idb'
import { type ChatItem, fileToBase64, postChatStream } from '@/services/ollama'
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

  const sendMsg = async (msg: string, chatId: string, imageFiles: File[]) => {
    if (!model) return

    try {
      clearMsg()
      setIsFetching(true)

      // ✅ 이미지를 base64로 변환
      let base64Images: string[] = []
      if (imageFiles.length > 0) {
        try {
          base64Images = await Promise.all(
            imageFiles.map(file => fileToBase64(file))
          )
        } catch (error) {
          console.error('Image conversion error:', error)
          toast.error('이미지 변환에 실패했습니다.')
          return
        }
      }

      // 이전 대화 기록
      const chatHistory = await getChatHistory(chatId)

      // ✅ 이미지가 있는 경우 images 필드 추가
      const historyItem: ChatHistoryItem = {
        model,
        role: 'user',
        content: msg,
        ...(base64Images.length > 0 && { images: base64Images }),
      }
      await logChatHistory(chatId, historyItem)
      queryClient.invalidateQueries({ queryKey: ['getChatHistory', chatId] })

      // ollama chat api call
      const curMsg: ChatItem = {
        role: 'user',
        content: msg,
        ...(base64Images.length > 0 && { images: base64Images }),
      }

      const msgList = [
        ...chatHistory.map(({ role, content, images }) => ({
          role,
          content,
          ...(images && { images }),
        })),
        curMsg,
      ]
      const res = await postChatStream({ model, messages: msgList }, 30000)

      if (!res.ok || res.body === null) {
        throw new Error('Stream response error')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      const locChunkList: string[] = []
      let buffer = ''

      try {
        while (true) {
          const { value, done } = await reader.read()

          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine) continue

            try {
              const data = JSON.parse(trimmedLine)

              if (data.message?.content) {
                locChunkList.push(data.message.content)
                appendMsg(data.message.content)
              }

              if (data.done) {
                console.log('Stream completed')
              }
            } catch (e) {
              console.warn('파싱 실패한 라인:', trimmedLine, e)
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      const historyAnsItem: ChatHistoryItem = {
        model,
        role: 'assistant',
        content: locChunkList.join(''),
      }
      await logChatHistory(chatId, historyAnsItem)
      queryClient.invalidateQueries({ queryKey: ['getChatHistory', chatId] })
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
    queryClient.invalidateQueries({ queryKey: ['getAllChatId'] })

    // ✅ 이미지 파일 전달
    sendMsg(msg, curChatId, imageFiles)

    // ✅ 이미지 전송 후 클리어
    if (images.length > 0) {
      clearImages()
    }

    if (!chatId) {
      navigate({ to: '/chat/$chatId', params: { chatId: curChatId } })
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
