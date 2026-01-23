import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import CodeBlock from './CodeBlock'

interface MessageContentProps {
  content: string
}

export default function MessageContent({ content }: MessageContentProps) {
  const components: Components = {
    // 코드 블록 렌더링
    code(props) {
      const { className, children } = props
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : undefined
      const code = String(children).replace(/\n$/, '')
      
      // 인라인 코드 판별: className이 없고 줄바꿈이 없으면 인라인 코드
      const isInline = !className && !code.includes('\n')

      return <CodeBlock language={language} code={code} inline={isInline} />
    },
    // 인라인 코드
    p({ children }) {
      return <p className="mb-2 last:mb-0">{children}</p>
    },
    // 리스트
    ul({ children }) {
      return <ul className="mb-2 ml-4 list-disc">{children}</ul>
    },
    ol({ children }) {
      return <ol className="mb-2 ml-4 list-decimal">{children}</ol>
    },
    li({ children }) {
      return <li className="mb-1">{children}</li>
    },
    // 링크
    a({ href, children }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-600"
        >
          {children}
        </a>
      )
    },
    // 강조
    strong({ children }) {
      return <strong className="font-bold">{children}</strong>
    },
    em({ children }) {
      return <em className="italic">{children}</em>
    },
    // 제목
    h1({ children }) {
      return <h1 className="mb-2 font-bold text-xl">{children}</h1>
    },
    h2({ children }) {
      return <h2 className="mb-2 font-bold text-lg">{children}</h2>
    },
    h3({ children }) {
      return <h3 className="mb-2 font-semibold text-base">{children}</h3>
    },
    // 인용구
    blockquote({ children }) {
      return (
        <blockquote className="my-2 border-l-4 border-muted-foreground pl-4 italic">
          {children}
        </blockquote>
      )
    },
    // 수평선
    hr() {
      return <hr className="my-4 border-muted-foreground" />
    },
  }

  return (
    <div className="markdown-content">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  )
}
