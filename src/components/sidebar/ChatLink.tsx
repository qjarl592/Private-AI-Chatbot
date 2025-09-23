import { Button } from "../shadcn/button";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { Link, type LinkProps } from "@tanstack/react-router";
import { SidebarMenuButton, SidebarMenuItem } from "../shadcn/sidebar";

interface Props extends Omit<LinkProps, "children" | "to"> {
  chatId?: string;
  title: string;
}

export default function ChatLink({ chatId, title, ...props }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenuItem className="relative">
      <SidebarMenuButton asChild>
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
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
