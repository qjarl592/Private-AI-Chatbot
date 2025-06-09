import { Card } from "../shadcn/card";
import { cn } from "@/lib/utils";
import { Textarea } from "../shadcn/textarea";
import { Button } from "../shadcn/button";
import { CornerDownLeft } from "lucide-react";
import ModelSelect from "./ModelSelect";
import type { Ref } from "react";

interface Props {
  align: "center" | "bottom";
  onUpdateHeight: () => void;
  ref?: Ref<HTMLDivElement>;
}

export default function InputBox({ align, onUpdateHeight, ref }: Props) {
  return (
    <Card
      ref={ref}
      className={cn("fixed z-10 flex w-[calc(100%-448px)] flex-col gap-0 p-0", {
        "bottom-8": align === "bottom",
      })}
    >
      <Textarea
        placeholder="Type your message here."
        className="max-h-[40vh] resize-none"
        onChange={onUpdateHeight}
      />
      <div className="flex w-full justify-end">
        <ModelSelect />
        <Button size="icon" variant="secondary">
          <CornerDownLeft />
        </Button>
      </div>
    </Card>
  );
}
