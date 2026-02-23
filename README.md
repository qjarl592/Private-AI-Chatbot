# Private AI Chat

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=Vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=Tailwind-CSS&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

로컬 Ollama AI 모델과 연결되는 프라이버시 중심 채팅 애플리케이션입니다. 모든 대화 데이터는 외부 서버로 전송되지 않고 사용자의 기기에만 안전하게 저장됩니다.

**🌐 라이브 데모**: [https://private-ai-chatbot-psi.vercel.app/](https://private-ai-chatbot-psi.vercel.app/)

## 🎯 주요 기능

### 핵심 기능
- **🔒 완전한 프라이버시**: 모든 채팅 데이터가 IndexedDB에 로컬 저장되며 외부 서버로 전송되지 않습니다.
- **🤖 로컬 AI 통합**: 로컬 머신에서 실행되는 Ollama 모델과 직접 통신합니다.
- **💬 실시간 스트리밍**: Fetch API를 활용한 끊김 없는 실시간 AI 응답을 지원합니다.
- **📚 채팅 히스토리**: 이전 대화 내역을 로컬 저장소에서 불러오고 관리할 수 있습니다.
- **🔄 다중 모델 지원**: 설치된 다양한 Ollama 모델 간의 실시간 전환이 가능합니다.

### 기술 스택
- **프론트엔드**: React 18, TypeScript, Vite, React Router v7
- **UI/스타일링**: Tailwind CSS, shadcn/ui, Radix UI, Lucide React
- **상태 관리**: Zustand (전역 상태), TanStack Query (서버 상태)
- **데이터 저장**: IndexedDB (idb 라이브러리)
- **코드 품질**: Biome (Linting & Formatting), Zod (Validation)

## 📋 설치 방법

### 사전 요구사항
본 애플리케이션은 로컬에 **Ollama**가 설치되어 있어야 합니다.

1.  **Ollama 설치**: [ollama.ai](https://ollama.ai)에서 운영체제에 맞는 버전을 다운로드하세요.
2.  **모델 다운로드**:
    ```bash
    ollama pull llama2
    ```
3.  **Ollama 서버 시작**:
    ```bash
    ollama serve
    ```
    *서버 기본 주소: `http://localhost:11434`*

### 애플리케이션 설치
1.  **저장소 클론**
    ```bash
    git clone <repository-url>
    cd private-ai-chat
    ```
2.  **의존성 설치**
    ```bash
    pnpm install
    ```
3.  **개발 서버 실행**
    ```bash
    pnpm dev
    ```

## 🌟 사용법

1.  **모델 선택**: 상단 드롭다운 메뉴에서 사용할 AI 모델을 선택합니다.
2.  **채팅 시작**: 메시지 입력창에 질문을 입력하고 전송합니다.
3.  **히스토리 확인**: 사이드바를 통해 과거 대화 목록을 확인하거나 삭제할 수 있습니다.
4.  **스크립트 활용**:
    - `pnpm build`: 프로덕션용 빌드
    - `pnpm lint`: 코드 린팅 실행
    - `pnpm format`: 코드 포맷팅 적용

### 프로젝트 구조
```
src/
├── components/          # UI 컴포넌트 (chat, sidebar, shadcn 등)
├── services/           # API (Ollama) 및 저장소 (IndexedDB) 로직
├── store/             # Zustand 상태 관리 스토어
├── hooks/             # 커스텀 훅
└── routes/            # 페이지 라우팅 설정
```

## ⚙️ 환경 변수

애플리케이션 설정을 위해 다음 환경 변수를 사용할 수 있습니다. 프로젝트 루트에 `.env` 파일을 생성하여 설정하세요.

```env
VITE_OLLAMA_URL=http://localhost:11434
```

- `VITE_OLLAMA_URL`: 로컬에서 실행 중인 Ollama API의 엔드포인트 주소입니다. (기본값: `http://localhost:11434`)

## 🤝 기여 방법

1.  프로젝트를 포크(Fork)합니다.
2.  새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`).
3.  변경 사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`).
4.  브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`).
5.  Pull Request를 생성합니다.

## 📄 라이선스

본 프로젝트는 MIT 라이선스에 따라 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.