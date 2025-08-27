# Private AI Chat

로컬 Ollama AI 모델과 연결되는 프라이버시 중심 채팅 애플리케이션입니다. 모든 대화가 사용자 기기에서 완전히 비공개로 유지됩니다.

## 🌐 라이브 데모

**Vercel 배포 링크**: [https://private-ai-chatbot-psi.vercel.app/](https://private-ai-chatbot-psi.vercel.app/)

## 🎯 주요 기능

- **🔒 완전한 프라이버시**: 모든 채팅 데이터가 IndexedDB에 로컬 저장 - 외부 서버 전송 없음
- **🤖 로컬 AI 통합**: 로컬 머신에서 실행되는 Ollama 모델과 연결
- **💬 실시간 스트리밍**: 스트리밍을 지원하는 실시간 AI 응답
- **📚 채팅 히스토리**: 로컬 저장소를 활용한 지속적인 대화 기록
- **🎨 모던 UI**: Tailwind CSS로 구축된 깔끔하고 반응형 인터페이스
- **🔄 다중 모델**: 다양한 Ollama 모델 간 전환 가능
- **⚡ 빠른 성능**: 최적의 개발 및 빌드 경험을 위한 Vite 사용

## 🏗️ 기술 스택

### 프론트엔드

- **React 18** (실험적 기능 포함)
- **TypeScript** 타입 안전성
- **Vite** 빠른 개발 및 빌드
- **React Router v7** 내비게이션

### UI 및 스타일링

- **Tailwind CSS** 스타일링
- **shadcn/ui** 컴포넌트 라이브러리
- **Radix UI** 프리미티브
- **Lucide React** 아이콘

### 상태 관리

- **Zustand** 전역 상태
- **TanStack Query** 서버 상태 관리

### 데이터 저장

- **IndexedDB** (idb 라이브러리) 로컬 데이터 지속성

### API 및 네트워킹

- **Axios** HTTP 요청
- **Fetch API** 스트리밍 응답

### 코드 품질

- **Biome** 린팅 및 포맷팅
- **Zod** 런타임 타입 검증

## 📋 사전 요구사항

이 애플리케이션을 실행하기 전에 Ollama를 로컬에 설치하고 실행해야 합니다:

1. **Ollama 설치**: [ollama.ai](https://ollama.ai)에서 운영체제에 맞는 버전 다운로드
2. **모델 다운로드**:
   ```bash
   ollama pull llama2  # 또는 다른 모델
   ```
3. **Ollama 서버 시작**:
   ```bash
   ollama serve
   ```
   서버는 `http://localhost:11434`에서 실행됩니다

## 🚀 시작하기

### 설치

1. **저장소 클론**

   ```bash
   git clone <repository-url>
   cd private-ai-chat
   ```

2. **의존성 설치**
   ```bash
   pnpm install
   ```
   > 이 프로젝트는 pnpm을 패키지 매니저로 사용합니다

### 개발

1. **개발 서버 시작**

   ```bash
   pnpm dev
   ```

2. **브라우저에서 열기**
   `http://localhost:5173`으로 이동

### 프로덕션 빌드

```bash
pnpm build
```

### 프로덕션 빌드 미리보기

```bash
pnpm preview
```

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── chat/           # 채팅 관련 컴포넌트
│   │   ├── ChatContainer.tsx
│   │   ├── ChatList.tsx
│   │   ├── ChatItem.tsx
│   │   ├── InputBox.tsx
│   │   └── ModelSelect.tsx
│   ├── sidebar/        # 사이드바 컴포넌트
│   ├── shadcn/         # shadcn/ui 컴포넌트
│   ├── layout/         # 레이아웃 컴포넌트
│   └── provider/       # 컨텍스트 프로바이더
├── pages/              # 페이지 컴포넌트
│   ├── chat/          # 채팅 페이지
│   └── guide/         # 가이드 페이지
├── services/           # API 서비스
│   ├── ollama.ts      # Ollama API 통합
│   └── idb.ts         # IndexedDB 작업
├── store/             # Zustand 스토어
│   ├── chatStreamStore.ts
│   ├── IdbStore.ts
│   └── modelListStore.ts
├── hooks/             # 커스텀 React 훅
└── routes/            # 라우트 설정
```

## 🔧 핵심 아키텍처

### 데이터 저장

- **Meta Store**: 채팅방 목록 및 메타데이터
- **Chat Store**: 개별 채팅 대화 기록
- 완전한 프라이버시를 위해 모든 데이터가 IndexedDB에 로컬 저장

### 상태 관리

- `chatStreamStore`: 실시간 채팅 스트리밍 상태
- `IdbStore`: IndexedDB 인스턴스 관리
- `modelListStore`: 사용 가능한 AI 모델 목록

### API 통합

- `http://localhost:11434`의 로컬 Ollama 서버에 연결
- 일반 및 스트리밍 응답 모두 지원
- 자동 모델 감지 및 목록화

## 🎨 UI 컴포넌트

현대적이고 접근 가능한 컴포넌트로 구축:

- **채팅 인터페이스**: 스트리밍을 통한 실시간 메시지 표시
- **모델 선택기**: AI 모델 선택을 위한 드롭다운
- **사이드바 내비게이션**: 채팅 히스토리 및 내비게이션
- **입력 박스**: 전송 기능이 있는 다중 라인 텍스트 입력

## 🛠️ 스크립트

- `pnpm dev` - 개발 서버 시작
- `pnpm build` - 프로덕션용 빌드
- `pnpm preview` - 프로덕션 빌드 미리보기
- `pnpm lint` - Biome 린터 실행
- `pnpm lint:fix` - 린팅 문제 수정
- `pnpm format` - Biome로 코드 포맷팅

## 🔐 프라이버시 기능

- **로컬 저장소만 사용**: 외부 서버로 데이터 전송 없음
- **브라우저 기반**: 모든 처리가 브라우저에서 발생
- **Ollama 통합**: 로컬 AI 모델과 직접 연결
- **추적 없음**: 분석이나 추적 스크립트 없음

## 🌟 사용법

1. **Ollama 설치 및 실행**: 사전 요구사항 섹션 참조
2. **모델 선택**: 드롭다운에서 사용할 AI 모델 선택
3. **채팅 시작**: 새 채팅 버튼을 클릭하거나 메시지 입력
4. **히스토리 관리**: 사이드바에서 이전 채팅 확인 및 관리

---
