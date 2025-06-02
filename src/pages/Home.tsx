import { getStatus } from "@/services/ollama";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["getStatus"],
    queryFn: getStatus,
  });

  useEffect(() => {
    if (error) {
      navigate("/guide");
    }
  }, [error, navigate]);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (data) {
    return <div>Home</div>;
  }

  return <></>;
}
