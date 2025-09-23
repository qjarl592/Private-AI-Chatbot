import { Settings } from "lucide-react";
import { Button } from "../shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import {
  getOllamaBaseURL,
  getStatus,
  setOllamaBaseURL,
} from "@/services/ollama";
import { Input } from "../shadcn/input";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function OllamaSetting() {
  const [open, setOpen] = useState(false);
  const curOllamaUrl = getOllamaBaseURL() ?? "";
  const [urlValue, setUrlValue] = useState(curOllamaUrl);
  const queryClient = useQueryClient();
  const [isErr, setIsErr] = useState(false);

  const onClickConnect = async () => {
    setOllamaBaseURL(urlValue);
    const prevStatus = queryClient.getQueryData(["todos"]);
    try {
      await queryClient.cancelQueries({ queryKey: ["getStatus"] });
      const newStatus = await getStatus();
      queryClient.setQueryData(["getStatus"], () => newStatus);
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
          <span className="font-semibold">Ollama URL</span>
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
        <div className="flex w-full justify-end gap-1">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onClickConnect}>Connect</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
