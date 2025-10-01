import { Button } from "../shadcn/button";
import { Check, EllipsisVertical, X } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import { SidebarMenuButton, SidebarMenuItem } from "../shadcn/sidebar";
import { Input } from "../shadcn/input";
import { useChatIdb } from "@/hooks/useChatIdb";
import { useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/store/confirmStore";

interface Props extends Omit<LinkProps, "children" | "to"> {
  chatId?: string;
  title: string;
}

export default function ChatLink({
  chatId,
  title: propsTitle,
  ...props
}: Props) {
  const { renameChat, deleteChat } = useChatIdb();
  const navigate = useNavigate();
  const { requestConfirm } = useConfirm();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(propsTitle);

  const onSave = async () => {
    if (!chatId) return;
    setEdit(false);
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
        setEdit(false);
        navigate({ to: "/chat" });
        queryClient.invalidateQueries({ queryKey: ["getAllChatId"] });
      },
    });
    setOpen(false);
  };

  return (
    <SidebarMenuItem className="relative">
      {!edit ? (
        <>
          <SidebarMenuButton
            asChild
            className="block h-9 overflow-hidden overflow-ellipsis whitespace-nowrap pr-8"
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
              <DropdownMenuItem onClick={() => setEdit(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="relative w-full">
          <Input
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
              setEdit(false);
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
