import { cn } from "@/lib/utils";

interface Props {
  side: "left" | "right";
}

export default function ChatItem({ side }: Props) {
  return (
    <div
      className={cn(
        "w-fit max-w-[80%] break-words rounded-2xl bg-gray-300 p-2",
        { "self-end": side === "right", "self-start": side === "left" }
      )}
    >
      sdsdsafsadfsadfasdfsadfsadfsadfsdafasdffsadfasfsdsdsafsadfsadfasdfsadfsadfsadfsdafasdffsadfasf
      sdsdsafsadfsadfasdfsadfsadfsadfsdafasdffsadfasf
      sdsdsafsadfsadfasdfsadfsadfsadfsdafasdffsadfasf
      sdsdsafsadfsadfasdfsadfsadfsadfsdafasdffsadfasf
      sdsdsafsadfsadfasdfsadfsadfsadfsdafasdffsadfasf
      sdsdsafsadfsadfasdfsadfsadfsadfsdafasdffsadfasf
    </div>
  );
}
