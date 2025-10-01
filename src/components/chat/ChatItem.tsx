import { cn } from "@/lib/utils";
// import { useChatStreamStore } from "@/store/chatStreamStore";
import type { ReactNode } from "react";

interface Props {
  side: "left" | "right";
  children: ReactNode;
}

export default function ChatItem({ side, children }: Props) {
  // const chunkList = useChatStreamStore((state) => state.chunkList);
  return (
    <div
      className={cn(
        "w-fit max-w-[80%] whitespace-pre-wrap break-words rounded-2xl bg-primary-foreground px-4 py-2 shadow-lg",
        { "self-end": side === "right", "w-[80%] self-start": side === "left" }
      )}
    >
      {children}
    </div>
  );
}
