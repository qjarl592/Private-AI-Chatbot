import { type IDBPDatabase, openDB } from 'idb'
import z from 'zod'
import { ChatItemSchema } from './ollama'

export const ChatInfoItemSchema = z.object({
  id: z.string(),
  title: z.string(),
})
export type ChatInfoItem = z.infer<typeof ChatInfoItemSchema>

// ✅ 이미지 지원을 위한 스키마 수정
const ChatHistoryItemSchema = ChatItemSchema.extend({
  model: z.optional(z.string()),
  timestamp: z.optional(z.string()), // ISO 8601 timestamp
})
export type ChatHistoryItem = z.infer<typeof ChatHistoryItemSchema>

export interface IdbItem {
  key: string
  value: ChatHistoryItem[] | ChatInfoItem[]
}

export type IdbStorage = 'meta' | 'chat'

const DB_NAME = 'private-ai-chat-db'
const DB_VERSION = 1
export const META_STORE = 'meta'
export const CHAT_STORE = 'chat'
export const IDB_ERRORS = {
  NOT_INITIALIZED: 'IDB instance is not initialized.',
  STORAGE_NOT_EXIST: 'IDB storage does not exist.',
  ITEM_NOT_FOUND: 'Item not found.',
} as const

export async function initIdb() {
  return await openDB<IdbItem>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' })
      }
      if (!db.objectStoreNames.contains(CHAT_STORE)) {
        db.createObjectStore(CHAT_STORE, { keyPath: 'key' })
      }
    },
  })
}

export async function addItem(
  idbInstance: IDBPDatabase<IdbItem> | null,
  storage: IdbStorage,
  item: IdbItem
) {
  const validIdb = validateAll(idbInstance, storage)
  const tx = validIdb.transaction(storage, 'readwrite')
  const store = tx.objectStore(storage)
  const res = await store.add(item)
  await tx.done
  return res
}

export async function getItem(
  idbInstance: IDBPDatabase<IdbItem> | null,
  storage: IdbStorage,
  key: string
) {
  const validIdb = validateAll(idbInstance, storage)
  const res = (await validIdb.get(storage, key)) as IdbItem | undefined
  if (res === undefined) throw new Error(IDB_ERRORS.ITEM_NOT_FOUND)
  return res
}

export async function getAllItem(
  idbInstance: IDBPDatabase<IdbItem> | null,
  storage: IdbStorage
) {
  const validIdb = validateAll(idbInstance, storage)
  const res = (await validIdb.getAll(storage)) as IdbItem[]
  return res
}

export async function updateItem(
  idbInstance: IDBPDatabase<IdbItem> | null,
  storage: IdbStorage,
  item: IdbItem
) {
  const validIdb = validateAll(idbInstance, storage)
  const tx = validIdb.transaction(storage, 'readwrite')
  const store = tx.objectStore(storage)
  const res = await store.put(item)
  await tx.done
  return res
}

export async function deleteItem(
  idbInstance: IDBPDatabase<IdbItem> | null,
  storage: IdbStorage,
  key: string
) {
  const validIdb = validateAll(idbInstance, storage)
  const tx = validIdb.transaction(storage, 'readwrite')
  const store = tx.objectStore(storage)
  await store.delete(key)
  await tx.done
}

export async function clearStorage(
  idbInstance: IDBPDatabase<IdbItem> | null,
  storage: IdbStorage
) {
  const validIdb = validateAll(idbInstance, storage)
  const tx = validIdb.transaction(storage, 'readwrite')
  const store = tx.objectStore(storage)
  await store.clear()
  await tx.done
}

// 검증 헬퍼 함수들
function validateIdbInstance(idbInstance: IDBPDatabase<IdbItem> | null) {
  if (!idbInstance) throw new Error(IDB_ERRORS.NOT_INITIALIZED)
  return idbInstance
}

function validateStorage(
  idbInstance: IDBPDatabase<IdbItem>,
  storage: IdbStorage
) {
  if (!idbInstance.objectStoreNames.contains(storage)) {
    throw new Error(IDB_ERRORS.STORAGE_NOT_EXIST)
  }
  return idbInstance
}

// 통합 검증 함수
function validateAll(
  idbInstance: IDBPDatabase<IdbItem> | null,
  storage: IdbStorage
) {
  const validIdb = validateStorage(validateIdbInstance(idbInstance), storage)
  return validIdb
}
