import { router } from "@/routes/route";
import { RouterProvider } from "react-router-dom";

export default function RouteProvider() {
  return <RouterProvider router={router} />;
}
