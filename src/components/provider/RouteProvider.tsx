import { router } from "@/routes/Route";
import { RouterProvider } from "react-router-dom";

export default function RouteProvider() {
  return <RouterProvider router={router} />;
}
