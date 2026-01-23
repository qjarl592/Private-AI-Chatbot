import { copyToClipboard } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toast } from 'sonner'
import { Button } from '../shadcn/button'
import { useTheme } from '../provider/ThemeProvider'

interface CodeBlockProps {
  language?: string
  code: string
  inline?: boolean
}

export default function CodeBlock({
  language,
  code,
  inline = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches
    ? 'dark'
    : 'light'
  // 현재 테마 결정 (system이면 systemTheme 사용)
  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  const handleCopy = () => {
    copyToClipboard(code, () => {
      setCopied(true)
      toast.success('코드가 복사되었습니다.')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // 인라인 코드
  if (inline) {
    return (
      <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm">
        {code}
      </code>
    )
  }

  // 코드 블록
  return (
    <div className="group relative my-2 overflow-hidden rounded-lg shadow">
      {/* 언어 레이블 및 복사 버튼 */}
      <div 
        className="flex items-center justify-between px-4 py-2"
        style={{ backgroundColor: isDark ? '#282c34' : '#fafafa' }}
      >
        <span className="font-mono text-muted-foreground text-xs uppercase">
          {language || 'text'}
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleCopy}
          aria-label="코드 복사"
        >
          {copied ? (
            <Check className="size-4 text-green-500" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>

      {/* 코드 내용 */}
      <SyntaxHighlighter
        language={language || 'text'}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.875rem',
          maxHeight: '500px',
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
