import logo from "../../assets/logo-helpdesk.png";

import {Link} from "react-router-dom"

import { useAuth } from "../../contexts/AuthContext";

const clientMenu = [
  {
    label: "Meus chamados",
    path: "/clients/my-tickets",
  },
  {
    label: "Criar chamado",
    path: "/clients",
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
    path: "/admin/tickets",
  },
  {
    label: "Clientes",
    path: "/admin/clients",
  },
  {
    label: "Técnicos",
    path: "/admin/technicians",
  },
  {
    label: "Serviços",
    path: "/admin/services",
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
            <Link
            key={item.path}
            to={item.path}
            className="
            block
            w-full
            rounded
            px-4
            py-2
            text-sm
          hover:bg-blue-600
            transition
        "
    >
      {item.label}
    </Link>
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
``