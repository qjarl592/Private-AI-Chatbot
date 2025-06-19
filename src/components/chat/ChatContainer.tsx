import { useCallback, useEffect, useRef, useState } from "react";
import ChatList from "./ChatList";
import InputBox from "./InputBox";
import { Button } from "../shadcn/button";
import { ChevronDown } from "lucide-react";

interface Props {
  chatId?: string;
}

export default function ChatContainer({ chatId }: Props) {
  const inputBoxRef = useRef<HTMLDivElement>(null);
  const [inputBoxHeight, setInputBoxHeight] = useState(0);

  const updateInputBoxHeight = useCallback(() => {
    if (!inputBoxRef.current) {
      setInputBoxHeight(0);
      return;
    }
    const curHeight = inputBoxRef.current.scrollHeight;
    setInputBoxHeight(curHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateInputBoxHeight);
    updateInputBoxHeight();

    return () => {
      window.removeEventListener("resize", updateInputBoxHeight);
    };
  }, [updateInputBoxHeight]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 pl-64">
      <div
        className="w-full px-24 pt-8"
        style={{ paddingBottom: `${32 + inputBoxHeight + 32}px` }}
      >
        {chatId && <ChatList chatId={chatId} />}
        <Button
          className="fixed z-10 flex h-14 w-[calc(100%-448px)] justify-center rounded-none"
          variant="ghost"
          style={{
            bottom: `${inputBoxHeight + 32}px`,
            background: `linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0) 0%,
              rgba(248, 250, 252, 1) 60%,
              rgba(248, 250, 252, 1) 100%
            )`,
          }}
        >
          <ChevronDown className="bg-transparent" />
        </Button>
        <InputBox
          chatId={chatId}
          ref={inputBoxRef}
          align="bottom"
          onUpdateHeight={updateInputBoxHeight}
        />
        <div
          className="fixed bottom-0 w-full bg-gray-50"
          style={{ height: `${32 + inputBoxHeight + 1}px` }}
        />
      </div>
    </div>
  );
}
