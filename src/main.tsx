import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import QueryProvider from "./components/provider/QueryProvider.tsx";
import RouteProvider from "./components/provider/RouteProvider.tsx";
import { Toaster } from "./components/shadcn/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <QueryProvider>
      <RouteProvider />
    </QueryProvider>
  </StrictMode>
);
