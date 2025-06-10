import { cn } from "@/lib/utils";
import { useChatStreamStore } from "@/store/chatStreamStore";

interface Props {
  side: "left" | "right";
}

export default function ChatItem({ side }: Props) {
  const chunkList = useChatStreamStore((state) => state.chunkList);
  console.log(chunkList);
  return (
    <div
      className={cn(
        "w-fit max-w-[80%] whitespace-pre-wrap break-words rounded-2xl bg-gray-300 p-2",
        { "self-end": side === "right", "w-[80%] self-start": side === "left" }
      )}
    >
      {chunkList.join("")}
    </div>
  );
}
