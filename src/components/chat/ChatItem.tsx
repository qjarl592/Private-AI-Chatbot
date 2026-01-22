import { addIncrementalIds, toObjectArray } from '@/lib/array'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import Optional from '../common/Optional'
import { Skeleton } from '../shadcn/skeleton'

interface Props {
  side: 'left' | 'right'
  children: ReactNode
  images?: string[] // ✅ 이미지 base64 배열 추가
}

export function ChatItem({ side, children, images }: Props) {
  return (
    <div
      className={cn(
        'w-fit max-w-[80%] whitespace-pre-wrap break-words rounded-2xl bg-primary-foreground px-4 py-2 shadow-lg',
        { 'self-end': side === 'right', 'w-[80%] self-start': side === 'left' }
      )}
    >
      {/* ✅ 이미지 표시 */}
      <Optional option={!!images && images.length > 0}>
        <div className="mb-2 flex flex-wrap gap-2">
          {addIncrementalIds(toObjectArray(images ?? [], 'img')).map(item => (
            <img
              key={item.id}
              src={`data:image/png;base64,${item.img}`}
              alt={`uploaded-${item.id}`}
              className="max-h-48 rounded-lg object-contain"
            />
          ))}
        </div>
      </Optional>

      {children}
    </div>
  )
}

export function ChatItemSkeleton({ side }: Pick<Props, 'side'>) {
  return (
    <Skeleton
      className={cn(
        'h-20 w-fit max-w-[80%] whitespace-pre-wrap break-words rounded-2xl bg-primary-foreground px-4 py-2 shadow-lg',
        {
          'w-[80%] self-end': side === 'right',
          'w-[80%] self-start': side === 'left',
        }
      )}
    />
  )
}
