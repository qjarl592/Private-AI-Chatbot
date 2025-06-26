import { NavLink, useParams, type NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "../shadcn/button";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";

interface Props extends Omit<NavLinkProps, "children" | "to"> {
  chatId?: string;
  title: string;
  isSomeOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function ChatLink({
  chatId,
  title,
  className,
  isSomeOpen,
  onOpen,
  onClose,
  ...props
}: Props) {
  const { chatId: curChatId } = useParams();
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const showMenu = !!chatId && (chatId === curChatId || isActive);

  const onActive = () => {
    if (!chatId) return;
    if (isActive) return;
    setIsActive(true);
  };

  const onInactive = () => {
    if (!chatId) return;
    if (!isActive) return;

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
        onClick={(e) => {
          if (isSomeOpen) {
            e.preventDefault();
          }
        }}
      >
        {title}
      </NavLink>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className={cn("-translate-y-1/2 absolute top-1/2 right-0", {
            hidden: !showMenu,
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
      <Button variant="link" size="lg">
        ss
      </Button>
    </div>
  );
}
