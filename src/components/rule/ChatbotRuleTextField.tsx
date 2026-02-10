import { Check, Copy, Edit, X } from 'lucide-react'
import { Button } from '../shadcn/button'
import { Textarea } from '../shadcn/textarea'
import { cn } from '@/lib/utils'

interface Props {
  label?: string
  disabled?: boolean
  value: string
  onValueChange: (value: string) => void
  isEditing?: boolean
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
}

export default function ChatbotRuleTextField({
  label,
  value,
  onValueChange,
  disabled = false,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
}: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
  }

  return (
    <div>
      {label && <label htmlFor="rule-textarea">{label}</label>}
      <div className="relative">
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          {isEditing ? (
            <>
              <Button
                size="icon"
                variant="outline"
                className="size-6 bg-accent hover:bg-accent/80"
                onClick={onSave}
                title="Save"
              >
                <Check className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="size-6 bg-accent hover:bg-accent/80"
                onClick={onCancel}
                title="Cancel"
              >
                <X className="size-4" />
              </Button>
            </>
          ) : (
            <Button
              size="icon"
              variant="outline"
              className="size-6 bg-accent hover:bg-accent/80"
              onClick={onEdit}
              title="Edit"
            >
              <Edit className="size-4" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            className="size-6 bg-accent hover:bg-accent/80"
            onClick={handleCopy}
            title="Copy"
          >
            <Copy className="size-4" />
          </Button>
        </div>
        <Textarea
          id="rule-textarea"
          value={value}
          onChange={e => onValueChange(e.target.value)}
          disabled={disabled}
          className={cn(
            disabled && 'cursor-not-allowed opacity-60 bg-muted'
          )}
        />
      </div>
    </div>
  )
}
