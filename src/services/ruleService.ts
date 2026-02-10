import { type IDBPDatabase } from 'idb'
import {
  type CustomRule,
  CustomRuleSchema,
  type GlobalRule,
  GlobalRuleSchema,
  type IdbItem,
  RULE_STORE,
} from './idb'

const GLOBAL_RULE_KEY = 'global'

/**
 * Get the global rule from IndexedDB
 */
export async function getGlobalRule(
  idbInstance: IDBPDatabase<IdbItem> | null
): Promise<GlobalRule | null> {
  if (!idbInstance) return null

  try {
    const result = await idbInstance.get(RULE_STORE, GLOBAL_RULE_KEY)
    if (!result) return null
    return GlobalRuleSchema.parse(result.value)
  } catch (error) {
    console.error('Failed to get global rule:', error)
    return null
  }
}

/**
 * Save or update the global rule
 */
export async function saveGlobalRule(
  idbInstance: IDBPDatabase<IdbItem> | null,
  content: string
): Promise<void> {
  if (!idbInstance) throw new Error('IDB instance is not initialized')

  const globalRule: GlobalRule = {
    content,
    updatedAt: new Date().toISOString(),
  }

  const tx = idbInstance.transaction(RULE_STORE, 'readwrite')
  const store = tx.objectStore(RULE_STORE)
  await store.put({ key: GLOBAL_RULE_KEY, value: globalRule })
  await tx.done
}

/**
 * Get all custom rules from IndexedDB
 */
export async function getAllCustomRules(
  idbInstance: IDBPDatabase<IdbItem> | null
): Promise<CustomRule[]> {
  if (!idbInstance) return []

  try {
    const allItems = await idbInstance.getAll(RULE_STORE)
    const customRules = allItems
      .filter(item => item.key !== GLOBAL_RULE_KEY)
      .map(item => CustomRuleSchema.parse(item.value))
    
    // Sort by updatedAt descending (newest first)
    return customRules.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  } catch (error) {
    console.error('Failed to get custom rules:', error)
    return []
  }
}

/**
 * Get a specific custom rule by ID
 */
export async function getCustomRule(
  idbInstance: IDBPDatabase<IdbItem> | null,
  id: string
): Promise<CustomRule | null> {
  if (!idbInstance) return null

  try {
    const result = await idbInstance.get(RULE_STORE, id)
    if (!result) return null
    return CustomRuleSchema.parse(result.value)
  } catch (error) {
    console.error('Failed to get custom rule:', error)
    return null
  }
}

/**
 * Create a new custom rule
 */
export async function createCustomRule(
  idbInstance: IDBPDatabase<IdbItem> | null,
  data: {
    title: string
    description: string
    content: string
    enabled?: boolean
  }
): Promise<CustomRule> {
  if (!idbInstance) throw new Error('IDB instance is not initialized')

  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  const customRule: CustomRule = {
    id,
    title: data.title,
    description: data.description,
    content: data.content,
    enabled: data.enabled ?? true,
    createdAt: now,
    updatedAt: now,
  }

  const tx = idbInstance.transaction(RULE_STORE, 'readwrite')
  const store = tx.objectStore(RULE_STORE)
  await store.put({ key: id, value: customRule })
  await tx.done

  return customRule
}

/**
 * Update an existing custom rule
 */
export async function updateCustomRule(
  idbInstance: IDBPDatabase<IdbItem> | null,
  id: string,
  data: Partial<Omit<CustomRule, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<CustomRule | null> {
  if (!idbInstance) throw new Error('IDB instance is not initialized')

  const existing = await getCustomRule(idbInstance, id)
  if (!existing) return null

  const updated: CustomRule = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  }

  const tx = idbInstance.transaction(RULE_STORE, 'readwrite')
  const store = tx.objectStore(RULE_STORE)
  await store.put({ key: id, value: updated })
  await tx.done

  return updated
}

/**
 * Delete a custom rule
 */
export async function deleteCustomRule(
  idbInstance: IDBPDatabase<IdbItem> | null,
  id: string
): Promise<void> {
  if (!idbInstance) throw new Error('IDB instance is not initialized')

  const tx = idbInstance.transaction(RULE_STORE, 'readwrite')
  const store = tx.objectStore(RULE_STORE)
  await store.delete(id)
  await tx.done
}

/**
 * Toggle the enabled state of a custom rule
 */
export async function toggleCustomRule(
  idbInstance: IDBPDatabase<IdbItem> | null,
  id: string
): Promise<CustomRule | null> {
  if (!idbInstance) throw new Error('IDB instance is not initialized')

  const existing = await getCustomRule(idbInstance, id)
  if (!existing) return null

  return updateCustomRule(idbInstance, id, { enabled: !existing.enabled })
}

/**
 * Get all active rules (global + enabled custom rules)
 */
export async function getActiveRules(
  idbInstance: IDBPDatabase<IdbItem> | null
): Promise<{ global: GlobalRule | null; custom: CustomRule[] }> {
  const [globalRule, customRules] = await Promise.all([
    getGlobalRule(idbInstance),
    getAllCustomRules(idbInstance),
  ])

  const enabledCustomRules = customRules.filter(rule => rule.enabled)

  return {
    global: globalRule,
    custom: enabledCustomRules,
  }
}

/**
 * Merge multiple rules into a single content string
 */
export function mergeRules(activeRules: {
  global: GlobalRule | null
  custom: CustomRule[]
}): string {
  const parts: string[] = []

  if (activeRules.global?.content) {
    parts.push(activeRules.global.content)
  }

  for (const rule of activeRules.custom) {
    if (rule.content) {
      parts.push(rule.content)
    }
  }

  return parts.join('\n\n')
}
