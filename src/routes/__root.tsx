import MainLayout from '@/components/layout/MainLayout'
import type { AppRouterContext } from '@/router'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <MainLayout>
      <Outlet />
    </MainLayout>
    {/* <TanStackRouterDevtools /> */}
  </>
)

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
})
