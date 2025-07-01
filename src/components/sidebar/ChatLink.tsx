import { NavLink, useParams, type NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../shadcn/button";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState, type FocusEvent, type MouseEvent } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";

interface Props extends Omit<NavLinkProps, "children" | "to"> {
  chatId?: string;
  title: string;
}

export default function ChatLink({
  chatId,
  title,
  className,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  const { chatId: curChatId } = useParams();
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const showMenu = !!chatId && (chatId === curChatId || isActive);

  const onActive = () => {
    if (!chatId) return;
    if (isActive) return;
    setIsActive(true);
  };

  const onInactive = (e: MouseEvent | FocusEvent) => {
    if (!chatId) return;
    if (!isActive) return;
    if (
      e.relatedTarget &&
      containerRef.current?.contains(e.relatedTarget as HTMLElement)
    )
      return;
    setIsActive(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative border border-black"
      onFocus={onActive}
      onBlur={onInactive}
      onMouseEnter={onActive}
      onMouseLeave={onInactive}
    >
      <NavLink
        {...props}
        className={cn(className, "block truncate pr-2")}
        to={chatId ? `/chat/${chatId}` : "/chat/new"}
      >
        {title}
      </NavLink>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          asChild
          className={cn("-translate-y-1/2 absolute top-1/2 right-0", {
            hidden: !open && !showMenu,
          })}
        >
          <Button variant="ghost" size="icon">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>sf</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
