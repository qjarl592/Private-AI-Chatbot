import { Alert, AlertDescription, AlertTitle } from '@/components/shadcn/alert'
import { Button, buttonVariants } from '@/components/shadcn/button'
import { copyToClipboard } from '@/lib/utils'
import { Link, createFileRoute } from '@tanstack/react-router'
import { AlertCircle, CopyCheck, ExternalLink, Info } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/guide')({
  component: Guide,
})

const commands = [
  {
    id: 'install-mac',
    title: 'Ollama 설치 (Mac)',
    command: 'brew install ollama',
    description: 'Mac에서 Homebrew를 사용하여 Ollama를 설치합니다.',
  },
  {
    id: 'install-linux',
    title: 'Ollama 설치 (Linux)',
    command: 'curl -fsSL https://ollama.com/install.sh | sh',
    description: 'Linux에서 Ollama를 설치합니다.',
  },
  {
    id: 'serve',
    title: 'Ollama 서버 시작',
    command: 'ollama serve',
    description:
      'Ollama 서버를 시작합니다. 이 명령은 백그라운드에서 서버를 실행합니다.',
  },
  {
    id: 'cors-mac-linux',
    title: 'CORS 설정 (Mac/Linux) - 중요!',
    command: 'OLLAMA_ORIGINS="*" ollama serve',
    description:
      '웹 브라우저에서 접근할 수 있도록 CORS를 허용합니다. 배포 환경에서 필수입니다.',
  },
  {
    id: 'pull',
    title: '모델 다운로드 (예: Llama2)',
    command: 'ollama pull llama2',
    description:
      'Llama2 모델을 다운로드합니다. 다른 모델로 변경할 수 있습니다.',
  },
]

const windowsCommands = [
  {
    id: 'cors-windows-powershell',
    title: 'CORS 설정 (Windows PowerShell) - 중요!',
    command: '$env:OLLAMA_ORIGINS="*"\nollama serve',
    description:
      'PowerShell에서 환경변수를 설정하고 Ollama를 실행합니다. 이 설정은 임시이며, 터미널을 닫으면 초기화됩니다.',
  },
]

function Guide() {
  const isProduction = import.meta.env.PROD

  const onClickCopy = (command: string) => {
    const onCopySuccess = () => {
      toast.success('클립보드에 복사되었습니다.')
    }
    copyToClipboard(command, onCopySuccess)
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto mt-8 max-w-3xl">
        <h1 className="mb-3 font-bold text-2xl">Ollama 설정 가이드</h1>

        {isProduction && (
          <Alert variant="default" className="mb-4 border-blue-500 bg-blue-50">
            <Info className="text-blue-500" />
            <AlertTitle className="text-blue-700">
              배포 환경에서 사용 중입니다
            </AlertTitle>
            <AlertDescription className="text-blue-600">
              웹 브라우저에서 로컬 Ollama 서버에 접근하려면{' '}
              <strong>CORS 설정이 필수</strong>입니다.
              <br />
              아래 "CORS 설정" 명령어를 사용하여 Ollama 서버를 시작해주세요.
            </AlertDescription>
          </Alert>
        )}

        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Ollama 서버 연결 필요</AlertTitle>
          <AlertDescription>
            현재 Ollama 서버에 연결할 수 없습니다. 아래 가이드를 따라 Ollama를
            설치하고 서버를 실행해주세요.
            {isProduction && (
              <>
                <br />
                <strong className="mt-2 inline-block">
                  ⚠️ CORS 설정 없이는 브라우저에서 접근할 수 없습니다!
                </strong>
              </>
            )}
          </AlertDescription>
        </Alert>

        <div className="mt-4 space-y-6">
          <section>
            <h2 className="mb-3 font-semibold text-xl">Ollama란?</h2>
            <p className="mb-2">
              Ollama는 로컬 환경에서 대규모 언어 모델(LLM)을 쉽게 실행할 수 있게
              해주는 도구입니다. 개인 정보 보호, 오프라인 사용, 커스터마이징이
              가능한 것이 장점입니다.
            </p>
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              Ollama 공식 웹사이트 방문하기
              <ExternalLink className="h-4 w-4" />
            </a>
          </section>

          <section>
            <h2 className="mb-3 font-semibold text-xl">설치 및 설정 단계</h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Ollama를 설치합니다 (아래 명령어를 사용)</li>
              <li className="font-medium text-red-600">
                {isProduction ? (
                  <>
                    <strong>CORS 설정과 함께</strong> Ollama 서버를 시작합니다
                    (배포 환경에서 필수!)
                  </>
                ) : (
                  'Ollama 서버를 시작합니다'
                )}
              </li>
              <li>원하는 LLM 모델을 다운로드합니다</li>
              <li>사이드바의 설정 메뉴에서 Ollama 서버에 연결합니다</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 font-semibold text-xl">
              명령어 목록 (Mac/Linux)
            </h2>
            <div className="space-y-4">
              {commands.map(cmd => (
                <div
                  key={`cmd-${cmd.id}`}
                  className={`rounded-lg border p-4 shadow-sm ${
                    cmd.id === 'cors-mac-linux' && isProduction
                      ? 'border-red-500 bg-red-50'
                      : 'bg-primary-foreground'
                  }`}
                >
                  <h3 className="mb-2 font-medium">
                    {cmd.title}
                    {cmd.id === 'cors-mac-linux' && isProduction && (
                      <span className="ml-2 text-red-600">★ 필수</span>
                    )}
                  </h3>
                  <div className="relative mb-2 flex items-center justify-between rounded-md bg-secondary p-3">
                    <code className="text-sm">{cmd.command}</code>
                    <Button
                      onClick={() => onClickCopy(cmd.command)}
                      size="icon"
                      className="absolute top-2 right-2 size-6 rounded-sm p-1"
                    >
                      <CopyCheck className="size-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {cmd.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-semibold text-xl">Windows 사용자</h2>
            <p className="mb-4">
              Windows 사용자는 먼저{' '}
              <a
                href="https://ollama.com/download/windows"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                공식 웹사이트
              </a>
              에서 Ollama를 설치한 후, 아래 명령어를 사용하세요.
            </p>
            <div className="space-y-4">
              {windowsCommands.map(cmd => (
                <div
                  key={`cmd-${cmd.id}`}
                  className={`rounded-lg border p-4 shadow-sm ${
                    isProduction
                      ? 'border-red-500 bg-red-50'
                      : 'bg-primary-foreground'
                  }`}
                >
                  <h3 className="mb-2 font-medium">
                    {cmd.title}
                    {isProduction && (
                      <span className="ml-2 text-red-600">★ 필수</span>
                    )}
                  </h3>
                  <div className="relative mb-2 flex items-center justify-between rounded-md bg-secondary p-3">
                    <code className="whitespace-pre text-sm">
                      {cmd.command}
                    </code>
                    <Button
                      onClick={() => onClickCopy(cmd.command)}
                      size="icon"
                      className="absolute top-2 right-2 size-6 rounded-sm p-1"
                    >
                      <CopyCheck className="size-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {cmd.description}
                  </p>
                </div>
              ))}
            </div>

            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Windows 영구 설정 방법</AlertTitle>
              <AlertDescription className="text-sm">
                <ol className="mt-2 list-decimal space-y-1 pl-4">
                  <li>"시스템 환경 변수 편집" 검색</li>
                  <li>"환경 변수" 버튼 클릭</li>
                  <li>"새로 만들기" 클릭</li>
                  <li>
                    변수 이름: <code>OLLAMA_ORIGINS</code>
                  </li>
                  <li>
                    변수 값: <code>*</code>
                  </li>
                  <li>PC 재시작</li>
                </ol>
              </AlertDescription>
            </Alert>
          </section>

          {isProduction && (
            <section>
              <Alert className="border-yellow-500 bg-yellow-50">
                <AlertCircle className="text-yellow-600" />
                <AlertTitle className="text-yellow-800">
                  보안 주의사항
                </AlertTitle>
                <AlertDescription className="text-yellow-700">
                  <code>OLLAMA_ORIGINS="*"</code> 설정은 모든 웹사이트에서
                  Ollama 서버에 접근할 수 있게 합니다.
                  <br />
                  <br />더 안전한 방법은 특정 도메인만 허용하는 것입니다:
                  <br />
                  <code className="mt-2 inline-block rounded bg-yellow-100 px-2 py-1">
                    OLLAMA_ORIGINS="https://private-ai-chatbot-psi.vercel.app"
                    ollama serve
                  </code>
                  <br />
                  <br />
                  ⚠️ 공용 Wi-Fi 사용 시 주의하세요!
                </AlertDescription>
              </Alert>
            </section>
          )}

          <section>
            <h2 className="mb-3 font-semibold text-xl">서버 연결하기</h2>
            <p className="mb-4">
              Ollama 서버를 {isProduction && <strong>CORS 설정과 함께</strong>}{' '}
              시작한 후,
              <strong> 사이드바의 설정 버튼(⚙️)</strong>을 클릭하여 연결하세요.
              <br />
              기본 URL은{' '}
              <code className="rounded bg-secondary px-2 py-0.5">
                http://localhost:11434
              </code>
              입니다.
            </p>
            {!isProduction && (
              <Link to="/" className={buttonVariants({ variant: 'default' })}>
                챗봇 페이지로 돌아가기
              </Link>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
