import { Button } from "../shadcn/button";
import { Check, EllipsisVertical, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import {
  Link,
  useNavigate,
  useParams,
  type LinkProps,
} from "@tanstack/react-router";
import { SidebarMenuButton, SidebarMenuItem } from "../shadcn/sidebar";
import { Input } from "../shadcn/input";
import { useChatIdb } from "@/hooks/useChatIdb";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/store/confirmStore";
import { cn } from "@/lib/utils";

interface Props extends Omit<LinkProps, "children" | "to"> {
  chatId: string;
  title: string;
  isEditing: boolean;
  onChangeEdit: (value: string | null) => void;
}

export default function ChatLink({
  chatId,
  title: propsTitle,
  isEditing,
  onChangeEdit,
  ...props
}: Props) {
  const { renameChat, deleteChat } = useChatIdb();
  const navigate = useNavigate();
  const { chatId: pathChatId } = useParams({ from: "/chat/$chatId" });
  const { requestConfirm } = useConfirm();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(propsTitle);

  const onSave = async () => {
    if (!chatId) return;
    onChangeEdit(null);
    await renameChat(chatId, title);
    queryClient.invalidateQueries({ queryKey: ["getAllChatId"] });
  };

  const onDelete = async () => {
    if (!chatId) return;
    requestConfirm({
      title: "대화를 삭제하시겠습니까?",
      description: "대화를 삭제하면 해당 대화의 모든 기록이 삭제됩니다.",
      actionText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        await deleteChat(chatId);
        onChangeEdit(null);
        navigate({ to: "/chat" });
        queryClient.invalidateQueries({ queryKey: ["getAllChatId"] });
      },
    });
    setOpen(false);
  };

  return (
    <SidebarMenuItem className="relative">
      {!isEditing ? (
        <>
          <SidebarMenuButton
            asChild
            className={cn(
              "block h-9 overflow-hidden overflow-ellipsis whitespace-nowrap pr-8",
              {
                "bg-sidebar-accent text-sidebar-accent-foreground":
                  pathChatId === chatId,
              }
            )}
          >
            <Link {...props} to="/chat/$chatId" params={{ chatId }}>
              {title}
            </Link>
          </SidebarMenuButton>

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
              <DropdownMenuItem onClick={() => onChangeEdit(chatId)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="relative w-full">
          <Input
            ref={(el) => {
              el?.focus();
              el?.select();
            }}
            className="w-full pr-16"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button
            className="-translate-y-1/2 -translate-x-8 absolute top-1/2 right-0 size-8 p-0"
            size="icon"
            variant="ghost"
            onClick={onSave}
          >
            <Check />
          </Button>
          <Button
            className="-translate-y-1/2 absolute top-1/2 right-0 size-8 p-0"
            size="icon"
            variant="ghost"
            onClick={() => {
              onChangeEdit(null);
              setTitle(propsTitle);
            }}
          >
            <X />
          </Button>
        </div>
      )}
    </SidebarMenuItem>
  );
}
