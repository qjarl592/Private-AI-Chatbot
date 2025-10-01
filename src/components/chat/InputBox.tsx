import { Card } from "../shadcn/card";
import { cn } from "@/lib/utils";
import { Textarea } from "../shadcn/textarea";
import { Button } from "../shadcn/button";
import { CornerDownLeft } from "lucide-react";
import ModelSelect from "./ModelSelect";
import { useRef, type KeyboardEvent, type Ref } from "react";
import { postChatStream, type ChatItem } from "@/services/ollama";
import { useChatStreamStore } from "@/store/chatStreamStore";
import { useChatIdb } from "@/hooks/useChatIdb";
import { useQueryClient } from "@tanstack/react-query";
import type { ChatHistoryItem } from "@/services/idb";
import { useNavigate } from "@tanstack/react-router";
import { useModelListStore } from "@/store/modelListStore";
import { useSidebarStore } from "@/store/sidebarStore";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { model } = useModelListStore();
  const { clearMsg, appendMsg, setIsFetching } = useChatStreamStore();
  const { startNewChat, logChatHistory, getChatHistory } = useChatIdb();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { open } = useSidebarStore();

  const sendMsg = async (msg: string, chatId: string) => {
    if (!model) return;
    // 이전 대화 기록
    const chatHistory = await getChatHistory(chatId);

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
    const msgList = [
      ...chatHistory.map(({ role, content }) => ({ role, content })),
      curMsg,
    ];
    const res = await postChatStream({ model, messages: msgList }, 30000);
    if (!res.ok || res.body === null) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const locChunkList = [];
    let buffer = "";

    if (!reader) return;
    try {
      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // 줄바꿈으로 분리
        const lines = buffer.split("\n");

        // 마지막 줄은 불완전할 수 있으므로 버퍼에 보관
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          try {
            const data = JSON.parse(trimmedLine);

            if (data.message?.content) {
              locChunkList.push(data.message.content);
              appendMsg(data.message.content);
            }

            if (data.done) {
              return;
            }
          } catch (_e) {
            console.warn("파싱 실패한 라인:", trimmedLine);
            // 작은따옴표가 문제라면 여기서 처리 가능
            // const fixed = trimmedLine.replace(/'/g, "\\'");
          }
        }
      }
    } finally {
      reader.releaseLock();
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
    textareaRef.current.value = "";

    const curChatId = chatId ?? (await startNewChat());
    if (!curChatId) return;
    queryClient.invalidateQueries({ queryKey: ["getAllChatId"] });

    sendMsg(msg, curChatId);
    if (!chatId) {
      navigate({ to: "/chat/$chatId", params: { chatId: curChatId } });
    } else {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 300);
    }
  };

  const onEnter = (e: KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;
    if (e.code.toLocaleLowerCase() !== "enter") return;
    if (e.shiftKey) return;
    e.preventDefault();
    onClickSend();
  };

  return (
    <Card
      ref={ref}
      className={cn(
        "fixed z-10 flex w-[calc(100%-192px)] max-w-[calc(64rem-192px)] flex-col gap-0 p-0",
        {
          "bottom-8": align === "bottom",
          "bottom-1/2 translate-y-full": align === "center",
          "w-[calc(100%-192px-16rem)]": open,
        }
      )}
    >
      <Textarea
        ref={textareaRef}
        placeholder="Type your message here."
        className="max-h-[40vh] resize-none"
        onChange={onUpdateHeight}
        onKeyDown={onEnter}
      />
      <div className="flex w-full justify-end">
        <ModelSelect />
        <Button size="icon" variant="secondary" onClick={onClickSend}>
          <CornerDownLeft />
        </Button>
      </div>
    </Card>
  );
}
