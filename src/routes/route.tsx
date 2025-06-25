import Guide from "@/pages/guide/Guide";
import Chat from "@/pages/chat/Chat";
import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import NewChat from "@/pages/chat/NewChat";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/chat" replace />,
  },
  {
    path: "chat",
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/chat/new" replace /> },
      { path: "new", element: <NewChat /> },
      { path: ":chatId", element: <Chat /> },
    ],
  },
  {
    path: "guide",
    element: <Guide />,
  },
]);
