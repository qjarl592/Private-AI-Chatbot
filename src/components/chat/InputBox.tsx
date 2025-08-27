import { Card } from "../shadcn/card";
import { cn } from "@/lib/utils";
import { Textarea } from "../shadcn/textarea";
import { Button } from "../shadcn/button";
import { CornerDownLeft } from "lucide-react";
import ModelSelect from "./ModelSelect";
import {
  startTransition,
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from "react";
import { postChatStream, type ChatItem } from "@/services/ollama";
import { useChatStreamStore } from "@/store/chatStreamStore";
import { useChatIdb } from "@/hooks/useChatIdb";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatHistoryItem } from "@/services/idb";

interface Props {
  chatId?: string;
  align: "center" | "bottom";
  onUpdateHeight?: () => void;
  ref?: Ref<HTMLDivElement>;
}

export default function InputBox({
  chatId,
  align,
  onUpdateHeight,
  ref,
}: Props) {
  const [model, setModel] = useState<null | string>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { clearMsg, appendMsg, setIsFetching } = useChatStreamStore();
  const { startNewChat, logChatHistory } = useChatIdb();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const sendMsg = async (msg: string, chatId: string) => {
    if (!model) return;

    // 대화 로그 기록
    const historyItem: ChatHistoryItem = {
      model,
      role: "user",
      content: msg,
    };
    await logChatHistory(chatId, historyItem);
    queryClient.invalidateQueries({ queryKey: ["getChatHistory", chatId] });

    // ollama chat api call
    const curMsg: ChatItem = {
      role: "user",
      content: msg,
    };
    setIsFetching(true);
    const res = await postChatStream({ model, messages: [curMsg] }, 30000);
    if (!res.ok || res.body === null) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const locChunkList = [];

    while (true) {
      const { value } = await reader.read();

      const chunk = decoder.decode(value, { stream: true });
      console.log(chunk);
      const chunkJson = JSON.parse(chunk);
      const { message, done } = chunkJson;

      locChunkList.push(message.content);
      appendMsg(message.content);
      if (done) {
        break;
      }
    }

    // 대화 로그 기록
    const historyAnsItem: ChatHistoryItem = {
      model,
      role: "assistant",
      content: locChunkList.join(""),
    };
    await logChatHistory(chatId, historyAnsItem);
    queryClient.invalidateQueries({ queryKey: ["getChatHistory", chatId] });
    clearMsg();
  };

  const onClickSend = async () => {
    if (!textareaRef.current) return;
    const msg = textareaRef.current.value.trim();
    if (msg.length === 0) return;

    const curChatId = chatId ?? (await startNewChat());
    if (!curChatId) return;

    if (!chatId) {
      startTransition(() => {
        navigate(`/chat/${curChatId}`, { replace: true });
      });
    }
    sendMsg(msg, curChatId);
  };

  const onEnter = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.code.toLocaleLowerCase() !== "enter") return;
    if (e.shiftKey) return;
    e.preventDefault();
    onClickSend();
  };

  const onSelectModel = useCallback((value: string) => {
    setModel(value);
  }, []);

  return (
    <Card
      ref={ref}
      className={cn("fixed z-10 flex w-[calc(100%-448px)] flex-col gap-0 p-0", {
        "bottom-8": align === "bottom",
        "bottom-1/2 translate-y-full": align === "center",
      })}
    >
      <Textarea
        ref={textareaRef}
        placeholder="Type your message here."
        className="max-h-[40vh] resize-none"
        onChange={onUpdateHeight}
        onKeyDown={onEnter}
      />
      <div className="flex w-full justify-end">
        <ModelSelect onSelect={onSelectModel} />
        <Button size="icon" variant="secondary" onClick={onClickSend}>
          <CornerDownLeft />
        </Button>
      </div>
    </Card>
  );
}
