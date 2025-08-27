import ChatLink from "./ChatLink";
import { Suspense } from "react";
import ChatLinkList from "./ChatLinkList";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 z-10 h-screen w-64 shadow-lg">
      Sidebar
      <nav className="flex flex-col">
        <ChatLink title="new chate" />
        <Suspense>
          <ChatLinkList />
        </Suspense>
      </nav>
    </div>
  );
}
