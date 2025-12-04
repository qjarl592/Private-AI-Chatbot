import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface Props {
  side: 'left' | 'right'
  children: ReactNode
  images?: string[] // ✅ 이미지 base64 배열 추가
}

export default function ChatItem({ side, children, images }: Props) {
  return (
    <div
      className={cn(
        'w-fit max-w-[80%] whitespace-pre-wrap break-words rounded-2xl bg-primary-foreground px-4 py-2 shadow-lg',
        { 'self-end': side === 'right', 'w-[80%] self-start': side === 'left' }
      )}
    >
      {/* ✅ 이미지 표시 */}
      {images && images.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <img
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={idx}
              src={`data:image/png;base64,${img}`}
              alt={`uploaded-${idx}`}
              className="max-h-48 rounded-lg object-contain"
            />
          ))}
        </div>
      )}
      {children}
    </div>
  )
}
