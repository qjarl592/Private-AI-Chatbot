import ChatItem from "./ChatItem";

export default function ChatList() {
  return (
    <div className="flex w-full flex-col gap-4">
      {Array.from({ length: 30 })
        .map((_, idx) => idx)
        .map((id) => (
          <ChatItem key={`chat-${id}`} side={id % 2 ? "left" : "right"} />
        ))}
    </div>
  );
}
