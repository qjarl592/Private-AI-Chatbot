import Guide from "@/pages/guide/Guide";
import Chat from "@/pages/chat/Chat";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

export const router = createBrowserRouter([
  {
    path: "chat",
    element: <MainLayout />,
    children: [{ path: "new", element: <Chat /> }],
  },
  {
    path: "guide",
    element: <Guide />,
  },
]);
