import { addIncrementalIds, toObjectArray } from '@/lib/array'
import { cn, copyToClipboard } from '@/lib/utils'
import { Copy, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import Optional from '../common/Optional'
import { Button } from '../shadcn/button'
import { Skeleton } from '../shadcn/skeleton'
import MessageContent from './MessageContent'

interface Props {
  side: 'left' | 'right'
  images?: string[] // ✅ 이미지 base64 배열 추가
  timestamp?: string // ISO 8601 timestamp
  content?: string // 메시지 내용 (복사 및 재시도용)
  onRetry?: (content: string, images?: string[]) => void // 재시도 콜백
}

export function ChatItem({ side, images, timestamp, content, onRetry }: Props) {
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = () => {
    if (!content) return
    copyToClipboard(content, () => {
      toast.success('클립보드에 복사되었습니다.')
    })
  }

  const handleRetry = () => {
    if (!content || !onRetry) return
    onRetry(content, images)
  }

  return (
    <div
      className="relative flex w-full flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'max-w-[80%] break-words rounded-2xl bg-primary-foreground px-4 py-2 shadow-lg',
          {
            'self-end': side === 'right',
            'self-start': side === 'left',
            'mb-7': !isHovered,
          }
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

        {/* 메시지 내용 - 마크다운 렌더링 */}
        {content && <MessageContent content={content} />}
      </div>

      {/* Utility Bar - 호버 시 표시 */}
      <Optional option={isHovered}>
        <ChatItemUtilBar
          timestamp={timestamp}
          side={side}
          onCopy={handleCopy}
          onRetry={side === 'right' ? handleRetry : undefined}
        />
      </Optional>
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

// ============================================================================
// ChatItemUtilBar Component
// ============================================================================

interface ChatItemUtilBarProps {
  timestamp?: string
  side: 'left' | 'right'
  onCopy: () => void
  onRetry?: () => void
}

function ChatItemUtilBar({
  timestamp,
  side,
  onCopy,
  onRetry,
}: ChatItemUtilBarProps) {
  const formattedTime = formatTimestamp(timestamp)

  return (
    <div
      className={cn(
        'mt-1 flex h-6 items-center gap-2 text-muted-foreground text-xs',
        {
          'self-end': side === 'right',
          'self-start': side === 'left',
        }
      )}
    >
      {/* 타임스탬프 */}
      <span className="select-none">{formattedTime}</span>

      {/* 복사 버튼 */}
      <Button
        size="icon"
        variant="ghost"
        className="size-6 rounded-sm p-1 hover:bg-secondary"
        onClick={onCopy}
        aria-label="복사"
      >
        <Copy className="size-3.5" />
      </Button>

      {/* 재시도 버튼 (사용자 메시지만) */}
      <Optional option={!!onRetry}>
        <Button
          size="icon"
          variant="ghost"
          className="size-6 rounded-sm p-1 hover:bg-secondary"
          onClick={onRetry}
          aria-label="재시도"
        >
          <RotateCcw className="size-3.5" />
        </Button>
      </Optional>
    </div>
  )
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * ISO 8601 타임스탬프를 yyyy-MM-dd hh:mm:ss 형식으로 변환
 */
function formatTimestamp(isoString?: string): string {
  if (!isoString) return ''

  const date = new Date(isoString)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
