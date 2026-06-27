import logo from "../../assets/logo-helpdesk.png";

import {NavLink} from "react-router-dom"

import { useAuth } from "../../contexts/AuthContext";

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

  const { user } = useAuth();
  
  const menu = user?.role === "client" ? clientMenu : user?.role === "technician" ? technicianMenu : adminMenu;

  return (
    <aside
      className="
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
            className={({isActive}) => `
              block
              w-full
              rounded
              px-4
              py-2
              text-sm
              ${isActive ? 'bg-blue-600' : 'hover:bg-blue-600'}
              transition
            `}

    >
      {item.label}
    </NavLink>
  ))}
</nav>

      </div>


      <div className="border-t border-zinc-700 pt-4">

        <p className="text-sm font-medium">
          {user?.name}
        </p>

        <p className="text-xs text-zinc-400">
          {user?.email}
        </p>

      </div>

    </aside>
  );
}
