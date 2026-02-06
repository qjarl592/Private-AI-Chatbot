import { type DateArg, type FormatOptions, format } from 'date-fns'

export const doNothing = () => {}

export const sleep = async (ms: number) =>
  new Promise<void>(() => setTimeout(doNothing, ms))

export const formatDateTo =
  (formatStr: string, options?: FormatOptions) => (date: DateArg<Date>) =>
    format(date, formatStr, options)

export const runWithNullable = <T extends readonly unknown[], R>(
  values: readonly [...T],
  fn: (...args: { [K in keyof T]: NonNullable<T[K]> }) => R
): R | undefined => {
  if (values.some(v => v === null || v === undefined)) {
    return undefined
  }
  return fn(...(values as unknown as { [K in keyof T]: NonNullable<T[K]> }))
}
