import {
  type UseSuspenseQueryOptions,
  type UseSuspenseQueryResult,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { type ReactNode } from 'react'

interface Props<T> extends UseSuspenseQueryOptions<T> {
  children(queryReturn: UseSuspenseQueryResult<T>): ReactNode
}

export default function UseSuspenseQuery<T>({
  children,
  ...queryOptions
}: Props<T>) {
  const queryReturn = useSuspenseQuery(queryOptions)
  return <>{children(queryReturn)}</>
}
