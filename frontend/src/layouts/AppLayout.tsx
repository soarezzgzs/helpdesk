import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-[#F5F5F5]">

      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}