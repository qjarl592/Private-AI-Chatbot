import ChatContainer from "@/components/chat/ChatContainer";
import Sidebar from "@/components/sidebar/Sidebar";
import { getStatus } from "@/services/ollama";
import { useModelListStore } from "@/store/modelListStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const setModelList = useModelListStore((state) => state.setModelList);
  const { data, isFetching, error } = useQuery({
    queryKey: ["getStatus"],
    queryFn: getStatus,
  });

  useEffect(() => {
    if (!data) return;
    setModelList(data.models);
  }, [data, setModelList]);

  useEffect(() => {
    if (error) {
      navigate("/guide");
    }
  }, [error, navigate]);

  if (!data && isFetching) {
    return <div>loading...</div>;
  }

  if (data) {
    return (
      <div className="w-screen">
        <Sidebar />
        <ChatContainer />
      </div>
    );
  }

  return <></>;
}
