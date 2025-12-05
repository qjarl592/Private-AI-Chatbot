import axios from 'axios'
import { z } from 'zod'

export const defaultUrl = 'http://localhost:11434'
const ollamaApiInstance = axios.create({
  baseURL: defaultUrl,
  responseType: 'json',
})

// baseURL 변경 함수
export function setOllamaBaseURL(newBaseURL: string) {
  ollamaApiInstance.defaults.baseURL = newBaseURL
}

// 현재 baseURL 조회 함수
export function getOllamaBaseURL() {
  return ollamaApiInstance.defaults.baseURL
}

const OllamaModelDetailSchema = z.object({
  parent_model: z.string(),
  format: z.string(),
  family: z.string(),
  families: z.nullable(z.array(z.string())),
  parameter_size: z.string(),
  quantization_level: z.string(),
})
export type OllamaModelDetail = z.infer<typeof OllamaModelDetailSchema>

const OllamaModelSchema = z.object({
  name: z.string(),
  model: z.string(),
  modified_at: z.string(),
  size: z.number(),
  digest: z.string(),
  details: OllamaModelDetailSchema,
})
export type OllamaModel = z.infer<typeof OllamaModelSchema>

const OllamaModelListSchema = z.object({
  models: z.array(OllamaModelSchema),
})
export type OllamaModelList = z.infer<typeof OllamaModelListSchema>

export async function getStatus() {
  const { data } = await ollamaApiInstance.get('/api/tags')
  return OllamaModelListSchema.parse(data)
}

// ✅ 이미지 지원을 위한 스키마 수정
export const ChatItemSchema = z.object({
  role: z.enum(['assistant', 'user']),
  content: z.string(),
  images: z.optional(z.array(z.string())), // base64 이미지 배열
})
export type ChatItem = z.infer<typeof ChatItemSchema>

interface OllamaChatProps {
  model: string
  messages: ChatItem[]
}

export function postChatStream(props: OllamaChatProps, timeout = 30000) {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeout)
  const apiUrl = getOllamaBaseURL()
  return fetch(`${apiUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...props, stream: true }),
    signal: controller.signal,
  })
}

export async function postChat(props: OllamaChatProps) {
  const { data } = await ollamaApiInstance.post('/api/chat', {
    ...props,
    stream: false,
  })
  return data
}

// ✅ 이미지를 base64로 변환하는 헬퍼 함수
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
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
}
