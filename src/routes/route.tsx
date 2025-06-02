import Guide from "@/pages/guide/Guide";
import Home from "@/pages/Home";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "guide",
    element: <Guide />,
  },
]);
