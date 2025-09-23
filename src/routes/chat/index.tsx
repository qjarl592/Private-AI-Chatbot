import InputBox from "@/components/chat/InputBox";
import { getStatus } from "@/services/ollama";
import { createFileRoute, redirect } from "@tanstack/react-router";

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
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <div className="flex h-screen w-full items-center justify-center px-24 pt-8">
        <p className="mb-30 font-bold text-4xl">Hello.</p>
        <InputBox align="center" />
      </div>
    </div>
  );
}
