import { getStatus } from "@/services/ollama";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import { useModelListStore } from "@/store/modelListStore";
import { useChatIdb } from "@/hooks/useChatIdb";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setModelList } = useModelListStore();
  const { idbInstance } = useChatIdb();

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
    if (!data) return;
    setModelList(data.models);
  }, [data, setModelList]);

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
        {idbInstance && <Sidebar />}
        <main className="w-screen">
          <Outlet />
        </main>
      </>
    );
  }

  return <></>;
}
