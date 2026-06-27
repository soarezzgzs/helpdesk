import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#F5F5F5]">

      <Sidebar />

      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}