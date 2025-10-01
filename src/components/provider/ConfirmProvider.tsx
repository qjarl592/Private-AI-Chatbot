import { useConfirmProvider } from '@/store/confirmStore'
import type { ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../shadcn/alert-dialog'

interface Props {
  children: ReactNode
}

export default function ConfirmProvider({ children }: Props) {
  const { resolver, isOpen, title, description, actionText, cancelText } =
    useConfirmProvider()

  const onAction = () => {
    resolver(true)
  }

  const onCancel = () => {
    resolver(false)
  }

  const onOpenChange = (open: boolean) => {
    if (!open && resolver) {
      resolver(false)
    }
  }

  return (
    <>
      {children}
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent className="min-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-line">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {cancelText && (
              <AlertDialogCancel onClick={onCancel}>
                {cancelText}
              </AlertDialogCancel>
            )}
            <AlertDialogAction onClick={onAction}>
              {actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
