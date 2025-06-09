import { useModelListStore } from "@/store/modelListStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";

export default function ModelSelect() {
  const modelList = useModelListStore((state) => state.modelList);

  if (modelList.length === 0) return;

  return (
    <Select defaultValue={modelList[0].model}>
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
