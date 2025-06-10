import ChatItem from "./ChatItem";

export default function ChatList() {
  return (
    <div className="flex w-full flex-col gap-4">
      <ChatItem side={"left"} />
    </div>
  );
}
