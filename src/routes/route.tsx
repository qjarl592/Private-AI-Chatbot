import Guide from "@/pages/guide/Guide";
import Chat from "@/pages/chat/Chat";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import NewChat from "@/pages/chat/NewChat";

export const router = createBrowserRouter([
  {
    path: "chat",
    element: <MainLayout />,
    children: [
      { path: "new", element: <NewChat /> },
      { path: ":chatId", element: <Chat /> },
    ],
  },
  {
    path: "guide",
    element: <Guide />,
  },
]);
