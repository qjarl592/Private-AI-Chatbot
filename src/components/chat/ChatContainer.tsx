import {
  useCallback,
  useEffect,
  useRef,
  useState,
  unstable_ViewTransition as ViewTransition,
} from "react";
import ChatList from "./ChatList";
import InputBox from "./InputBox";

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
    <div className="min-h-screen overflow-x-hidden bg-muted">
      <div
        className="w-full px-24 pt-8"
        style={{ paddingBottom: `${32 + inputBoxHeight + 32}px` }}
      >
        {chatId && <ChatList chatId={chatId} />}
        <ViewTransition name="input-box" update="position-change">
          <InputBox
            chatId={chatId}
            ref={inputBoxRef}
            align="bottom"
            onUpdateHeight={updateInputBoxHeight}
          />
        </ViewTransition>
      </div>
    </div>
  );
}
