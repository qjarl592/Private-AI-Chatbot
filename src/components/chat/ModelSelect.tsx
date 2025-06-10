import { useModelListStore } from "@/store/modelListStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { useEffect } from "react";

interface Props {
  onSelect: (value: string) => void;
}

export default function ModelSelect({ onSelect }: Props) {
  const modelList = useModelListStore((state) => state.modelList);

  useEffect(() => {
    if (modelList.length === 0) return;
    onSelect(modelList[0].model);
  }, [modelList, onSelect]);

  if (modelList.length === 0) return;

  return (
    <Select defaultValue={modelList[0].model} onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {modelList.map((model) => (
            <SelectItem value={model.model} key={model.model}>
              {model.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
