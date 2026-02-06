import { useConfirm } from '@/store/confirmStore'
import { Check, Copy, Edit, X } from 'lucide-react'
import { useRef, useState } from 'react'
import SwitchCase from '../common/SwitchCase'
import { Button } from '../shadcn/button'
import { Textarea } from '../shadcn/textarea'

interface Props {
  label?: string
  disabled?: boolean
  value: string
  onValueChange: (value: string) => void
}

export default function ChatbotRuleTextField({
  label,
  value,
  onValueChange,
  disabled = false,
}: Props) {
  const { requestConfirm } = useConfirm()
  const [isEdit, setIsEdit] = useState(false)
  const prevValueRef = useRef<string>('')

  return (
    <div>
      {label && <label htmlFor="rule-textarea">{label}</label>}
      <div className="relative">
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <SwitchCase
            value={isEdit ? 'edit' : 'view'}
            caseBy={{
              edit: (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-6 bg-accent"
                    onClick={() => {
                      requestConfirm({
                        title: '수정을 저장하시겠습니까?',
                        description:
                          '수정을 저장하면 이전 내용으로 돌아갈 수 없습니다.',
                        actionText: '예',
                        cancelText: '아니요',
                        onConfirm: () => {
                          setIsEdit(false)
                          onValueChange(value)
                        },
                      })
                    }}
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-6 bg-accent"
                    onClick={() => {
                      requestConfirm({
                        title: '수정을 취소하시겠습니까?',
                        description:
                          '수정을 취소하면 이전 내용으로 복원됩니다.',
                        actionText: '예',
                        cancelText: '아니요',
                        onConfirm: () => {
                          setIsEdit(false)
                          onValueChange(prevValueRef.current)
                        },
                      })
                    }}
                  >
                    <X className="size-4" />
                  </Button>
                </>
              ),
              view: (
                <Button
                  size="icon"
                  variant="outline"
                  className="size-6 bg-accent"
                  onClick={() => {
                    setIsEdit(true)
                    prevValueRef.current = value
                  }}
                >
                  <Edit className="size-4" />
                </Button>
              ),
            }}
          />
          <Button size="icon" variant="outline" className="size-6 bg-accent">
            <Copy className="size-4" />
          </Button>
        </div>
        <Textarea
          id="rule-textarea"
          value={value}
          onChange={e => onValueChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
