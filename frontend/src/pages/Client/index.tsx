import { AppLayout } from "../../layouts/AppLayout";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface Ticket {
  id: string;
  title: string;
  status: string;
  createdAt: string;

  technician: {
    name: string;
    avatarUrl: string | null;
  };

  service: {
    name: string;
    amount: number;
  };
}

export function Client() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  async function loadTickets() {
    try {
      const response = await api.get("/tickets/my-tickets");

      setTickets(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  function getStatusBadge(status: string) {
    switch (status) {
      case "open":
        return (
          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-medium">
            Aberto
          </span>
        );

      case "in_progress":
        return (
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
            Em atendimento
          </span>
        );

      case "closed":
        return (
          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
            Encerrado
          </span>
        );

      default:
        return status;
    }
  }

  return (
    <AppLayout>
      <div className="bg-white rounded-xl border border-zinc-200 p-8">

        <h1 className="text-3xl font-semibold text-[#3347B0]">
          Meus chamados
        </h1>

        <div className="mt-8 overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="text-left text-sm text-zinc-500 border-b">

                <th className="pb-4 font-medium">
                  Atualizado em
                </th>

                <th className="pb-4 font-medium">
                  Id
                </th>

                <th className="pb-4 font-medium">
                  Título
                </th>

                <th className="pb-4 font-medium">
                  Serviço
                </th>

                <th className="pb-4 font-medium">
                  Valor total
                </th>

                <th className="pb-4 font-medium">
                  Técnico
                </th>

                <th className="pb-4 font-medium">
                  Status
                </th>

                <th className="pb-4"></th>

              </tr>
            </thead>

            <tbody>
              {tickets.map((ticket) => {


                return (
                  <tr
                    key={ticket.id}
                    className="border-b border-zinc-200"
                  >
                    <td className="py-5 text-sm text-zinc-600">
                      {new Date(ticket.createdAt)
                        .toLocaleDateString("pt-BR")}
                    </td>

                    <td className="text-sm font-medium">
                      {ticket.id.slice(0, 5)}
                    </td>

                    <td className="font-medium">
                      {ticket.title}
                    </td>

                    <td>
                      {ticket.service.name}
                    </td>

                    <td>
                      {ticket.service.amount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      })}
                    </td>

                    <td>
                      <div className="flex items-center gap-2">

                        {ticket.technician.avatarUrl ? (

  <img
    src={`http://localhost:3333/uploads/${ticket.technician.avatarUrl}`}
    alt={ticket.technician.name}
    className="
      h-6
      w-6
      rounded-full
      object-cover
    "
  />

) : (

  <div
    className="
      h-6
      w-6
      rounded-full
      bg-blue-600
      text-white
      text-xs
      flex
      items-center
      justify-center
    "
  >
    {ticket.technician.name
      .charAt(0)
      .toUpperCase()}
  </div>

)}

                        <span>
                          {ticket.technician.name}
                        </span>

                      </div>
                    </td>

                    <td>
                      {getStatusBadge(ticket.status)}
                    </td>

                    <td>
                      <Link
                      to={`/ticket/${ticket.id}`}
                        className="
                          p-2
                          rounded-lg
                          bg-zinc-100
                          hover:bg-zinc-200
                          transition
                        "
                      >
                        <Eye size={16} />
                      </Link>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>

      </div>
    </AppLayout>
  );
}