import InputBox from "@/components/chat/InputBox";
import { getStatus } from "@/services/ollama";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/chat/")({
  loader: async ({ context }) => {
    if (!context.queryClient) return;
    try {
      return await context.queryClient.fetchQuery({
        queryKey: ["getStatus"],
        queryFn: getStatus,
      });
    } catch (err) {
      console.log(err);
      throw redirect({ to: "/guide" });
    }
  },
  component: NewChat,
});

function NewChat() {
  useEffect(() => {
    // 컴포넌트 마운트 시 body 스크롤 막기
    document.body.style.overflow = "hidden";

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="h-screen w-full bg-muted">
      <div className="flex h-screen w-full items-center justify-center px-24 pt-8">
        <p className="mb-30 font-bold text-4xl">Hello.</p>
        <InputBox align="center" />
      </div>
    </div>
  );
}
