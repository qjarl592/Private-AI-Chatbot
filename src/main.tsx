import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "./components/shadcn/sonner.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 설정
      refetchOnWindowFocus: false,
      retry: false,
      refetchOnMount: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ queryClient }} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
