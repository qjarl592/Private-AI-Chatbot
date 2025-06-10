import { Card } from "../shadcn/card";
import { cn } from "@/lib/utils";
import { Textarea } from "../shadcn/textarea";
import { Button } from "../shadcn/button";
import { CornerDownLeft } from "lucide-react";
import ModelSelect from "./ModelSelect";
import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from "react";
import { postChat } from "@/services/ollama";
import { useChatStreamStore } from "@/store/chatStreamStore";

interface Props {
  align: "center" | "bottom";
  onUpdateHeight: () => void;
  ref?: Ref<HTMLDivElement>;
}

export default function InputBox({ align, onUpdateHeight, ref }: Props) {
  const [model, setModel] = useState<null | string>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { clearMsg, appendMsg } = useChatStreamStore();

  const sendMsg = async (msg: string) => {
    if (!model) return;
    const curMsg = {
      role: "user",
      content: msg,
    };
    const res = await postChat({ model, messages: [curMsg] });
    if (!res.ok || res.body === null) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value } = await reader.read();

      const chunk = decoder.decode(value, { stream: true });
      const chunkJson = JSON.parse(chunk);
      const { message, done } = chunkJson;
      console.log(message.content);

      appendMsg(message.content);
      if (done) {
        break;
      }
    }
    clearMsg();
  };

  const onClickSend = () => {
    if (!textareaRef.current) return;
    const msg = textareaRef.current.value.trim();
    if (msg.length === 0) return;
    sendMsg(msg);
  };

  const onEnter = (e: KeyboardEvent) => {
    // if (!e.nativeEvent.isComposing) return;
    if (e.code.toLocaleLowerCase() !== "enter") return;
    e.preventDefault();
    onClickSend();
  };

  console.log(model);
  const onSelectModel = useCallback((value: string) => {
    setModel(value);
  }, []);

  return (
    <Card
      ref={ref}
      className={cn("fixed z-10 flex w-[calc(100%-448px)] flex-col gap-0 p-0", {
        "bottom-8": align === "bottom",
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
