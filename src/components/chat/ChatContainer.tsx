import { useRef, unstable_ViewTransition as ViewTransition } from "react";
import ChatList from "./ChatList";
import InputBox from "./InputBox";

interface Props {
  chatId?: string;
}

export default function ChatContainer({ chatId }: Props) {
  const inputBoxRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen overflow-x-hidden bg-muted">
      <div className="w-full px-24 pt-16">
        {chatId && <ChatList chatId={chatId} />}
        <ViewTransition name="input-box" update="position-change">
          <InputBox chatId={chatId} ref={inputBoxRef} align="bottom" />
        </ViewTransition>
      </div>
    </div>
  );
}
