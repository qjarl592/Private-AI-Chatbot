import { getStatus } from "@/services/ollama";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, isFetching, error } = useQuery({
    queryKey: ["getStatus"],
    queryFn: getStatus,
  });

  useEffect(() => {
    if (error) {
      navigate("/guide");
    }
  }, [error, navigate]);

  useEffect(() => {
    const pathList = location.pathname.split("/").filter((p) => p.length > 0);
    if (pathList.length === 1 && pathList[0] === "chat") {
      navigate("/chat/new");
    }
  }, [location, navigate]);

  if (!data && isFetching) {
    return <div>loading...</div>;
  }

  if (data) {
    return (
      <>
        <Sidebar />
        <main className="w-screen">
          <Outlet />
        </main>
      </>
    );
  }

  return <></>;
}
