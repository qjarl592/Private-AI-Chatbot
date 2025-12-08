import MainLayout from '@/components/layout/MainLayout'
import type { AppRouterContext } from '@/router'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <MainLayout>
      <Outlet />
    </MainLayout>
    {/* <TanStackRouterDevtools /> */}
  </>
)

// ✅ 404 페이지 컴포넌트
function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="font-bold text-4xl">404</h1>
      <p className="text-muted-foreground">페이지를 찾을 수 없습니다</p>
      <Link
        to="/"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound, // ✅ 404 컴포넌트 추가
})
