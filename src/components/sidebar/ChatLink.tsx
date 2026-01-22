import { useChatIdb } from '@/hooks/useChatIdb'
import { cn } from '@/lib/utils'
import { chatIdbQueryFactory } from '@/queries/chatIdb'
import { useConfirm } from '@/store/confirmStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Link,
  type LinkProps,
  useNavigate,
  useParams,
} from '@tanstack/react-router'
import { Check, EllipsisVertical, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../shadcn/dropdown-menu'
import { Input } from '../shadcn/input'
import { SidebarMenuButton, SidebarMenuItem } from '../shadcn/sidebar'

interface Props extends Omit<LinkProps, 'children' | 'to'> {
  chatId: string
  title: string
  isEditing: boolean
  onChangeEdit: (value: string | null) => void
}

export default function ChatLink({
  chatId,
  title,
  isEditing,
  onChangeEdit,
  ...props
}: Props) {
  const navigate = useNavigate()
  const { chatId: pathChatId } = useParams({ strict: false })
  const queryClient = useQueryClient()
  const { renameChat, deleteChat } = useChatIdb()
  const { requestConfirm } = useConfirm()

  const { mutate: saveChatMutation } = useMutation({
    mutationFn: async (newTitle: string) => {
      if (!chatId) return
      onChangeEdit(null)
      await renameChat(chatId, newTitle)
      queryClient.invalidateQueries(chatIdbQueryFactory.chatIdList())
    },
  })

  const { mutateAsync: deleteChatMutation } = useMutation({
    mutationFn: async () => {
      if (!chatId) return
      requestConfirm({
        title: '대화를 삭제하시겠습니까?',
        description: '대화를 삭제하면 해당 대화의 모든 기록이 삭제됩니다.',
        actionText: '삭제',
        cancelText: '취소',
        onConfirm: async () => {
          await deleteChat(chatId)
          onChangeEdit(null)
          navigate({ to: '/chat' })
          queryClient.invalidateQueries(chatIdbQueryFactory.chatIdList())
        },
      })
    },
  })

  return (
    <SidebarMenuItem className="relative">
      {(() => {
        if (!isEditing) {
          return (
            <>
              <SidebarMenuButton
                asChild
                className={cn(
                  'block h-9 overflow-hidden overflow-ellipsis whitespace-nowrap pr-8',
                  {
                    'bg-sidebar-accent text-sidebar-accent-foreground':
                      pathChatId === chatId,
                  }
                )}
              >
                <Link {...props} to="/chat/$chatId" params={{ chatId }}>
                  {title}
                </Link>
              </SidebarMenuButton>

              <SidebarChatDropdown
                onChangeEdit={() => onChangeEdit(chatId)}
                onDelete={deleteChatMutation}
              />
            </>
          )
        }

        return (
          <SidebarChatTitleInput
            title={title}
            cancelEdit={() => onChangeEdit(null)}
            editTitle={newTitle => {
              saveChatMutation(newTitle)
              onChangeEdit(null)
            }}
          />
        )
      })()}
    </SidebarMenuItem>
  )
}

interface SidebarChatDropdownProps {
  onChangeEdit: () => void
  onDelete: () => Promise<void>
}

const SidebarChatDropdown = ({
  onChangeEdit,
  onDelete,
}: SidebarChatDropdownProps) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-translate-y-1/2 absolute top-1/2 right-2 h-6 w-6"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={onChangeEdit}>Edit</DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await onDelete()
            setOpen(false)
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface SidebarChatTitleInputProps {
  title: string
  cancelEdit: () => void
  editTitle: (newTitle: string) => void
}

const SidebarChatTitleInput = ({
  title,
  cancelEdit,
  editTitle,
}: SidebarChatTitleInputProps) => {
  const [inputTitle, setInputTitle] = useState(title)

  return (
    <div className="relative w-full">
      <Input
        ref={el => {
          el?.focus()
          el?.select()
        }}
        className="w-full pr-16"
        value={inputTitle}
        onChange={e => setInputTitle(e.target.value)}
      />
      <Button
        className="-translate-y-1/2 -translate-x-8 absolute top-1/2 right-0 size-8 p-0"
        size="icon"
        variant="ghost"
        onClick={() => editTitle(inputTitle)}
      >
        <Check />
      </Button>
      <Button
        className="-translate-y-1/2 absolute top-1/2 right-0 size-8 p-0"
        size="icon"
        variant="ghost"
        onClick={() => {
          cancelEdit()
          setInputTitle(title)
        }}
      >
        <X />
      </Button>
    </div>
  )
}
