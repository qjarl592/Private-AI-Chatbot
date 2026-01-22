import { ollamaQueryFactory } from '@/queries/ollama'
import { useModelListStore } from '@/store/modelListStore'
import { useQuery } from '@tanstack/react-query'
import Optional from '../common/Optional'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../shadcn/select'

export default function ModelSelect() {
  const { data } = useQuery(ollamaQueryFactory.models.list())
  const { model, setModel } = useModelListStore()

  return (
    <Optional option={!!data && data.models.length > 0}>
      <Select
        value={model ?? undefined}
        onValueChange={value => setModel(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {data?.models.map(model => (
              <SelectItem value={model.model} key={model.model}>
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Optional>
  )
}
