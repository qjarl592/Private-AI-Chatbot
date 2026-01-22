import { type ReactNode } from 'react'

interface Props {
  option: boolean
  children: ReactNode
}

export default function Optional({ option, children }: Props) {
  if (option) {
    return children
  }
}
