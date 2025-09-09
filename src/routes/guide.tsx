import { Alert, AlertDescription, AlertTitle } from "@/components/shadcn/alert";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, CopyCheck } from "lucide-react";

export const Route = createFileRoute("/guide")({
  component: Guide,
});

const commands = [
  {
    id: "install-mac",
    title: "Ollama 설치 (Mac)",
    command: "brew install ollama",
    description: "Mac에서 Homebrew를 사용하여 Ollama를 설치합니다.",
  },
  {
    id: "install-linux",
    title: "Ollama 설치 (Linux)",
    command: "curl -fsSL https://ollama.com/install.sh | sh",
    description: "Linux에서 Ollama를 설치합니다.",
  },
  {
    id: "serve",
    title: "Ollama 서버 시작",
    command: "ollama serve",
    description:
      "Ollama 서버를 시작합니다. 이 명령은 백그라운드에서 서버를 실행합니다.",
  },
  {
    id: "pull",
    title: "모델 다운로드 (예: Llama2)",
    command: "ollama pull llama2",
    description:
      "Llama2 모델을 다운로드합니다. 다른 모델로 변경할 수 있습니다.",
  },
];

function Guide() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl">Ollama 설정 가이드</h1>
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Unable to process your payment.</AlertTitle>
          <AlertDescription>
            현재 Ollama 서버에 연결할 수 없습니다. 아래 가이드를 따라 Ollama를
            설치하고 서버를 실행해주세요.
          </AlertDescription>
        </Alert>
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 font-semibold text-xl">Ollama란?</h2>
            <p className="mb-2">
              Ollama는 로컬 환경에서 대규모 언어 모델(LLM)을 쉽게 실행할 수 있게
              해주는 도구입니다. 개인 정보 보호, 오프라인 사용, 커스터마이징이
              가능한 것이 장점입니다.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-semibold text-xl">설치 및 설정 단계</h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Ollama를 설치합니다 (아래 명령어를 사용)</li>
              <li>Ollama 서버를 시작합니다</li>
              <li>원하는 LLM 모델을 다운로드합니다</li>
              <li>이 애플리케이션으로 돌아와 챗봇을 사용합니다</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 font-semibold text-xl">명령어 목록</h2>
            <div className="space-y-4">
              {commands.map((cmd) => (
                <div
                  key={`cmd-${cmd.id}`}
                  className="rounded-lg border bg-white p-4 shadow-sm"
                >
                  <h3 className="mb-2 font-medium">{cmd.title}</h3>
                  <div className="mb-2 flex items-center justify-between rounded-md bg-gray-100 p-3">
                    <code className="text-sm">{cmd.command}</code>
                    <button
                      // onClick={() => copyToClipboard(cmd.command, index)}
                      className="ml-2 rounded border border-blue-500 px-3 py-1 text-blue-500 text-sm transition-colors duration-200 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      <CopyCheck />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">{cmd.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-4">
            <h2 className="mb-3 font-semibold text-xl">서버 상태 확인</h2>
            <p className="mb-4">
              Ollama 서버를 시작한 후, 아래 버튼을 클릭하여 챗봇 페이지로
              돌아갑니다.
            </p>
            <Link
              to="/"
              className="inline-block rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              챗봇 페이지로 돌아가기
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
