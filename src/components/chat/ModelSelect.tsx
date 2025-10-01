import { useModelListStore } from '@/store/modelListStore'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shadcn/select'

export default function ModelSelect() {
  const { modelList, model, setModel } = useModelListStore()

  if (modelList.length === 0) return

  return (
    <Select value={model} onValueChange={value => setModel(value)}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {modelList.map(model => (
            <SelectItem value={model.model} key={model.model}>
              {model.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
