import type { ReactNode } from "react";
import { useState } from "react";
import { Menu } from "lucide-react";
import logo from "../assets/logo.svg";
import {useAuth} from "../contexts/AuthContext";
import { Sidebar } from "../components/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({
  children,
}: AppLayoutProps) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

    const { user } = useAuth();

    const roleLabel = user?.role === "client" ? "CLIENTE" : user?.role === "technician" ? "TÉCNICO" : "ADMIN";

  return (
    <div className="h-screen bg-[#F5F5F5] flex overflow-hidden">

      {/* DESKTOP */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MOBILE DRAWER */}
      {sidebarOpen && (
        <>
          <div
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              fixed
              inset-0
              bg-black/50
              z-40
              md:hidden
            "
          />

          <div
            className="
              fixed
              left-0
              top-0
              z-50
              md:hidden
            "
          >
            <Sidebar />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* MOBILE HEADER */}
        <header
  className="
    h-20
    md:hidden
    bg-[#11131A]
    text-white
    flex
    items-center
    justify-between
    px-4
    shrink-0
  "
>

  <button
    onClick={() =>
      setSidebarOpen(true)
    }
    className="
      h-10
      w-10
      flex
      items-center
      justify-center
      rounded-lg
      bg-zinc-800
    "
  >
    <Menu size={20} />
  </button>

  <div
    className="
      flex
      items-center
      gap-3
      flex-1
      ml-3
    "
  >
    <div>
      <img
        src={logo}
        alt="Logo"
        className="
          h-10
          w-10
        "
      />
    </div>

    <div>

      <h1
        className="
          text-xl
          font-semibold
        "
      >
        HelpDesk
      </h1>

      <p
        className="
          text-xxs
          text-blue-400
          font-semibold
          tracking-wider
        "
      >
        {roleLabel}
      </p>

    </div>

  </div>

  {user?.avatarUrl ? (

    <img
      src={`http://localhost:3333/uploads/${user.avatarUrl}`}
      alt={user.name}
      className="
        h-10
        w-10
        rounded-full
        object-cover
      "/>

  ) : (

    <div
      className="
        h-10
        w-10
        rounded-full
        bg-blue-700
        flex
        items-center
        justify-center
        text-sm
        font-semibold
      "
    >
      {user?.name
        ?.split(" ")
        .map(word => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </div>

  )}

</header>

        <main
          className="
            flex-1
            overflow-y-auto
            p-4
            md:p-8
          "
        >
          {children}
        </main>

      </div>

    </div>
  );
}