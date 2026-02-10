import type { ChatHistoryItem } from '@/services/idb'
import { type ChatItem, postChatStream } from '@/services/ollama'

interface SendChatMessageParams {
  model: string
  content: string
  images?: string[]
  chatHistory: ChatHistoryItem[]
  onChunk: (chunk: string) => void
  timeout?: number
  rules?: string
}

interface SendChatMessageResult {
  success: boolean
  fullResponse: string
  error?: Error
}

/**
 * Ollama API를 통해 채팅 메시지를 전송하고 스트리밍 응답을 처리합니다.
 * 
 * @param params - 채팅 메시지 전송에 필요한 파라미터
 * @returns 전송 결과 (성공 여부, 전체 응답, 에러)
 */
export async function sendChatMessage({
  model,
  content,
  images,
  chatHistory,
  onChunk,
  timeout = 30000,
  rules,
}: SendChatMessageParams): Promise<SendChatMessageResult> {
  try {
    // 현재 메시지 생성
    const curMsg: ChatItem = {
      role: 'user',
      content,
      ...(images && images.length > 0 && { images }),
    }

    // 전체 메시지 리스트 구성
    const msgList: ChatItem[] = [
      // Rules를 system message로 prepend
      ...(rules ? [{ role: 'system' as const, content: rules }] : []),
      ...chatHistory.map(({ role, content, images }) => ({
        role,
        content,
        ...(images && { images }),
      })),
      curMsg,
    ]

    // Ollama API 호출
    const res = await postChatStream({ model, messages: msgList }, timeout)

    if (!res.ok || res.body === null) {
      throw new Error('Stream response error')
    }

    // 스트림 응답 처리
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    const chunkList: string[] = []
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
              chunkList.push(data.message.content)
              onChunk(data.message.content)
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

    return {
      success: true,
      fullResponse: chunkList.join(''),
    }
  } catch (error) {
    console.error('Send chat message error:', error)
    return {
      success: false,
      fullResponse: '',
      error: error instanceof Error ? error : new Error('Unknown error'),
    }
  }
}

/**
 * 파일을 base64 문자열로 변환합니다.
 * 
 * @param files - 변환할 파일 배열
 * @returns base64 문자열 배열
 */
export async function convertFilesToBase64(files: File[]): Promise<string[]> {
  if (files.length === 0) return []

  return Promise.all(
    files.map(
      file =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              // data:image/png;base64, 제거하고 순수 base64만 추출
              const base64 = reader.result.split(',')[1]
              resolve(base64)
            } else {
              reject(new Error('Failed to convert file to base64'))
            }
          }
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })
    )
  )
}
