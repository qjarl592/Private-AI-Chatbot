import InputBox from "@/components/chat/InputBox";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/chat/")({
  component: NewChat,
});

function NewChat() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50 pl-64">
      <div className="flex h-screen w-full items-center justify-center px-24 pt-8">
        <p className="mb-30 font-bold text-4xl">Hello.</p>
        <InputBox align="center" />
      </div>
    </div>
  );
}
