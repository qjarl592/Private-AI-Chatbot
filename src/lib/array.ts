export function addIncrementalIds<T>(array: T[]): (T & { id: number })[] {
  return array.map((item, index) => ({ ...item, id: index }))
}

export function toObjectArray<T>(
  array: T[],
  key = 'value'
): { [K in typeof key]: T }[] {
  return array.map(value => ({ [key]: value }))
}

/**
 *
 * @param arr
 */
export function getMin<T>(arr: T[]): T | undefined
export function getMin<T>(arr: T[], key: keyof T): T | undefined
export function getMin<T>(
  arr: T[],
  compareFn: (a: T, b: T) => boolean
): T | undefined
export function getMin<T>(
  arr: T[],
  keyOrCompareFn?: keyof T | ((a: T, b: T) => boolean)
): T | undefined {
  if (arr.length === 0) return undefined

  const firstItem = arr[0]
  return arr.slice(1).reduce((minItem, curItem) => {
    const isCurMin =
      keyOrCompareFn === undefined
        ? curItem < minItem
        : typeof keyOrCompareFn === 'function'
          ? keyOrCompareFn(curItem, minItem)
          : curItem[keyOrCompareFn] < minItem[keyOrCompareFn]

    return isCurMin ? curItem : minItem
  }, firstItem)
}

/**
 *
 * @param arr
 */
export function getMax<T>(arr: T[]): T | undefined
export function getMax<T>(arr: T[], key: keyof T): T | undefined
export function getMax<T>(
  arr: T[],
  compareFn: (a: T, b: T) => boolean
): T | undefined
export function getMax<T>(
  arr: T[],
  keyOrCompareFn?: keyof T | ((a: T, b: T) => boolean)
): T | undefined {
  if (arr.length === 0) return undefined

  const firstItem = arr[0]
  return arr.slice(1).reduce((maxItem, curItem) => {
    const isCurMax =
      keyOrCompareFn === undefined
        ? curItem > maxItem
        : typeof keyOrCompareFn === 'function'
          ? keyOrCompareFn(curItem, maxItem)
          : curItem[keyOrCompareFn] > maxItem[keyOrCompareFn]

    return isCurMax ? curItem : maxItem
  }, firstItem)
}

export function clamp<T>(arr: T[], min: T, max: T): T[]
export function clamp<T, K extends keyof T>(
  arr: T[],
  key: K,
  min: T[K],
  max: T[K]
): T[]
export function clamp<T, K extends keyof T>(
  arr: T[] | number[],
  keyOrMin: K | number,
  minOrMax: number,
  max?: number
): T[] | number[] {
  if (typeof keyOrMin === 'number') {
    const numArr = arr as number[]
    const min = keyOrMin
    const maximum = minOrMax

    return numArr.map(value => Math.max(min, Math.min(maximum, value)))
  }

  const objArr = arr as T[]
  const key = keyOrMin as K
  const min = minOrMax
  const maximum = max!

  return objArr.map(item => ({
    ...item,
    [key]: Math.max(min, Math.min(maximum, item[key] as number)) as T[K],
  }))
}

/**
 *
 * @param arr
 */
export const chunk = <T>(arr: T[], chunkUnit: number) => {
  return Array.from({ length: Math.ceil(arr.length / chunkUnit) }, (_, i) =>
    arr.slice(i * chunkUnit, i * chunkUnit + chunkUnit)
  )
}

/**
 *
 * @param arr
 */
export function range(end: number): number[]
export function range(start: number, end: number): number[]
export function range(startOrEnd: number, end?: number): number[] {
  return typeof end === 'number'
    ? Array.from({ length: end - startOrEnd }).map((_, idx) => idx + startOrEnd)
    : Array.from({ length: startOrEnd }).map((_, idx) => idx)
}

/**
 *
 * @param arr
 */
export const head = <T>(arr: T[], cnt = 1) => {
  if (arr.length === 0) return undefined
  return arr.slice(0, cnt)
}

/**
 *
 * @param arr
 */
export const tail = <T>(arr: T[], cnt = 1) => {
  if (arr.length === 0) return undefined
  return arr.slice(Math.max(0, arr.length - cnt), arr.length)
}

/**
 * 커링된 배열 필터링 함수
 * 조건을 먼저 설정하고, 나중에 배열에 적용할 수 있습니다.
 * @param predicate - 필터링 조건 함수
 * @returns 배열을 받아 필터링된 결과를 반환하는 함수
 * @example
 * const filterEven = filterBy<number>(n => n % 2 === 0);
 * filterEven([1, 2, 3, 4]); // [2, 4]
 */
export const filterBy = <T>(predicate: (item: T) => boolean) => {
  return (arr: T[]): T[] => arr.filter(predicate)
}

/**
 * 특정 값과 일치하는 항목만 필터링
 * @param value - 비교할 값
 * @returns 배열을 받아 일치하는 항목만 반환하는 함수
 * @example
 * const filterActive = filterByValue<{status: string}>('active', item => item.status);
 * filterActive(users); // status가 'active'인 user만 반환
 */
export const filterByValue = <T, V>(value: V, selector: (item: T) => V) => {
  return (arr: T[]): T[] => arr.filter(item => selector(item) === value)
}

/**
 * 특정 속성 값으로 필터링 (객체 배열용)
 * @param key - 필터링할 속성 키
 * @param value - 비교할 값
 * @returns 배열을 받아 필터링된 결과를 반환하는 함수
 * @example
 * const filterById = filterByProperty<User>('id', 123);
 * filterById(users); // id가 123인 user만 반환
 */
export const filterByProperty = <T extends object, K extends keyof T>(
  key: K,
  value: T[K]
) => {
  return (arr: T[]): T[] => arr.filter(item => item[key] === value)
}
