import { useCallback, useState } from 'react'

export const useToggleState = (initialState = false) => {
  const [value, setValue] = useState<boolean>(initialState)
  const toggleValue = useCallback(() => {
    setValue(!value)
  }, [value])
  return { value, toggleValue }
}
