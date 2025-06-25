import { NavLink, useParams, type NavLinkProps } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { cn } from "@/lib/utils";
import { Button } from "../shadcn/button";
import { EllipsisVertical } from "lucide-react";
import { useRef, useState } from "react";

interface Props extends Omit<NavLinkProps, "children" | "to"> {
  chatId?: string;
  title: string;
  isSomeOpen: boolean;
  onOpen: () => void;
}

export default function ChatLink({
  chatId,
  title,
  className,
  isSomeOpen,
  onOpen,
  ...props
}: Props) {
  const { chatId: curChatId } = useParams();
  const [isActive, setIsActive] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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
      ref={popoverRef}
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
          console.log("dfsdfs", isSomeOpen);
          if (isSomeOpen) {
            e.preventDefault();
          }
        }}
      >
        {title}
      </NavLink>
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          if (open) onOpen();
          setIsOpen(open);
        }}
      >
        <PopoverTrigger
          className={cn("-translate-y-1/2 absolute top-1/2 right-0", {
            "opacity-0": !showMenu && !isOpen,
          })}
          asChild
        >
          <Button size="icon" variant="ghost" className="size-6 p-0">
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>con</div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
