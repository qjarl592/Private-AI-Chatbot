import { getStatus } from '@/services/ollama'
import { queryOptions } from '@tanstack/react-query'

export const ollamaQueryFactory = {
  all: () => ['ollama'],
  models: {
    all: () => [...ollamaQueryFactory.all(), 'models'],
    list: () =>
      queryOptions({
        queryKey: [...ollamaQueryFactory.models.all(), 'list'],
        queryFn: getStatus,
      }),
  },
}
