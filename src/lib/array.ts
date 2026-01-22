export function addIncrementalIds<T>(array: T[]): (T & { id: number })[] {
  return array.map((item, index) => ({ ...item, id: index }))
}

export function toObjectArray<T>(
  array: T[],
  key = 'value'
): { [K in typeof key]: T }[] {
  return array.map(value => ({ [key]: value }))
}

export function range(end: number): number[]
export function range(start: number, end: number): number[]
export function range(startOrEnd: number, end?: number): number[] {
  if (end === undefined) {
    // range(10) 형태: 0부터 시작
    return Array.from({ length: startOrEnd }, (_, i) => i)
  }
  // range(5, 10) 형태: start부터 end까지
  return Array.from({ length: end - startOrEnd }, (_, i) => startOrEnd + i)
}
