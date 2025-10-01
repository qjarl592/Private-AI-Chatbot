import { Info, RefreshCcw, Settings } from "lucide-react";
import { Button } from "../shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import {
  defaultUrl,
  getOllamaBaseURL,
  getStatus,
  setOllamaBaseURL,
} from "@/services/ollama";
import { Input } from "../shadcn/input";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useModelListStore } from "@/store/modelListStore";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn/tooltip";

export default function OllamaSetting() {
  const [open, setOpen] = useState(false);
  const curOllamaUrl = getOllamaBaseURL() ?? "";
  const [urlValue, setUrlValue] = useState(curOllamaUrl);
  const queryClient = useQueryClient();
  const [isErr, setIsErr] = useState(false);
  const { setModelList, setModel } = useModelListStore();

  const connectOllama = async (url: string) => {
    setOllamaBaseURL(url);
    const prevStatus = queryClient.getQueryData(["todos"]);
    try {
      await queryClient.cancelQueries({ queryKey: ["getStatus"] });
      const newStatus = await getStatus();
      queryClient.setQueryData(["getStatus"], () => newStatus);
      setModelList(newStatus.models);
      if (newStatus.models.length > 0) {
        setModel(newStatus.models[0].model);
      }
      setOpen(false);
    } catch (e) {
      console.log(e);
      queryClient.setQueryData(["getStatus"], () => prevStatus);
      setIsErr(true);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="size-12 rounded-full">
          <Settings className="size-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        alignOffset={12}
        sideOffset={6}
        className="flex flex-col gap-2"
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="font-semibold">Ollama URL</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  외부 네트워크에 연결하면 대화 기록 유출 위험이 있습니다.
                </TooltipContent>
              </Tooltip>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-4 p-0"
              onClick={() => connectOllama(defaultUrl)}
            >
              <RefreshCcw className="size-4" />
            </Button>
          </div>
          <Input
            value={urlValue}
            placeholder="Input Ollama URL to connect."
            onChange={(e) => {
              setUrlValue(e.target.value);
              setIsErr(false);
            }}
            className="mt-2"
            aria-invalid={isErr} // boolean 값
          />
          {isErr && (
            <p className="mt-1 text-destructive text-sm">
              Cannot Connect to given URL
            </p>
          )}
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button onClick={() => connectOllama(urlValue)}>연결</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
