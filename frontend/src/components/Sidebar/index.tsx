import logo from "../../assets/logo-helpdesk.png";

import { NavLink } from "react-router-dom";
import { useState } from "react";

import {useNavigate} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import {LogOut, UserCircle2} from "lucide-react"

import {ProfileModal} from "../ProfileModal";

const clientMenu = [
  {
    label: "Meus chamados",
    path: "/tickets/my-tickets",
  },
  {
    label: "Criar chamado",
    path: "/tickets/create-ticket",
  },
];

const technicianMenu = [
  {
    label: "Chamados atribuídos",
    path: "/tickets/assigned",
  },
];

const adminMenu = [
  {
    label: "Chamados",
    path: "/tickets/admin",
  },
  {
    label: "Clientes",
    path: "/clients/admin",
  },
  {
    label: "Técnicos",
    path: "/technicians/admin",
  },
  {
    label: "Serviços",
    path: "/services/admin",
  },
];

export function Sidebar() {
  const [showProfileModal, setShowProfileModal] =
    useState(false);

  const [showMenu, setShowMenu] =
    useState(false);

    const navigate = useNavigate();

  const {
    user,
    signOut,
  } = useAuth();

  const menu =
    user?.role === "client"
      ? clientMenu
      : user?.role === "technician"
      ? technicianMenu
      : adminMenu;

      function handleSignOut() {
        signOut()
        navigate("/")
      }

  return (
    <>
      <aside
        className="
          relative
          w-64
          bg-[#11131A]
          text-white
          flex
          flex-col
          justify-between
          p-6
        "
      >
        <div>
          <img
            src={logo}
            alt="HelpDesk"
            className="w-36 mb-10"
          />

          <nav className="space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  block
                  w-full
                  rounded
                  px-4
                  py-2
                  text-sm
                  ${
                    isActive
                      ? "bg-blue-600"
                      : "hover:bg-blue-600"
                  }
                  transition
                `}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        
      <div className="relative">


        <button
          onClick={() =>
            setShowMenu(!showMenu)
          }
          className="w-full text-left hover:bg-zinc-900 rounded-xl transition p-2"
        >
          <div
  className="
    border-t
    border-zinc-700
    pt-4
    flex
    items-center
    gap-3
  "
>
{user?.avatarUrl ? (

  <img
    src={`http://localhost:3333/uploads/${user.avatarUrl}`}
    alt={user.name}
    className="
      h-10
      w-10
      rounded-full
      object-cover
      border
      border-zinc-700
    "
  />

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

<div>

  <p className="text-sm font-medium">
    {user?.name}
  </p>

  <p className="text-xs text-zinc-400">
    {user?.email}
  </p>

</div>
          </div>
        </button>

        {showMenu && (

  <div
    className="
      absolute
      bottom-0
      left-full
      ml-8
      bg-[#0B0D14]
      border
      border-zinc-800
      rounded-xl
      p-5
      shadow-2xl
      w-56
      z-50
    "
  >

    <p
      className="
        text-xs
        uppercase
        tracking-wider
        text-zinc-500
        mb-4
      "
    >
      Opções
    </p>

    <button
      onClick={() => {
        setShowProfileModal(true);
        setShowMenu(false);
      }}
      className="
        w-full
        flex
        items-center
        gap-3
        py-3
        text-zinc-300
        hover:text-white
        transition
      "
    >
      <UserCircle2 size={18} />
      <span>Perfil</span>
    </button>

    <button
      onClick={handleSignOut}
      className="
        w-full
        flex
        items-center
        gap-3
        py-3
        text-red-500
        hover:text-red-400
        transition
      "
    >
      <LogOut size={18} />
      <span>Sair</span>
    </button>

  </div>

)}
</div>
      </aside>
            <ProfileModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
            />
    </>
  );
}