import { type ReactNode } from 'react'

interface Props {
  option: boolean
  children: ReactNode
  fallback?: ReactNode
}

export default function Optional({ option, children, fallback }: Props) {
  if (option) {
    return children
  }
  if (fallback) {
    return fallback
  }
}
