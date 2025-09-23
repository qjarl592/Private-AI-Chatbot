import MainLayout from "@/components/layout/MainLayout";
import type { AppRouterContext } from "@/router";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <MainLayout>
      <Outlet />
    </MainLayout>
    {/* <TanStackRouterDevtools /> */}
  </>
);

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
});
