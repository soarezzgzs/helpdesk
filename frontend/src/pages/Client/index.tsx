import { AppLayout } from "../../layouts/AppLayout";
import { useEffect, useState } from "react";
import { api, API_URL } from "../../services/api";
import { Eye, CircleQuestionMark, Clock, CircleCheckBig} from "lucide-react";
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

  additionalServices: {
    id: string;
    description: string;
    amount: number;
  }[];
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
          <span className="bg-red-200 text-red-100 px-3 py-1 rounded-full text-xs w-fit font-medium flex justify-center items-center gap-1">
            <CircleQuestionMark size={14} />
            Aberto
          </span>
        );

      case "in_progress":
        return (
          <span className="bg-blue-200 text-blue-600 px-3 py-1 rounded-full text-xs w-fit font-medium flex justify-center items-center gap-1">
            <Clock size={14} />
            Em atendimento
          </span>
        );

      case "closed":
        return (
          <span className="bg-green-200 text-green-100 px-3 py-1 rounded-full text-xs w-fit font-medium flex justify-center items-center gap-1">
            <CircleCheckBig size={14} />
            Encerrado
          </span>
        );

      default:
        return status;
    }
  }


  return (
  <AppLayout>
    <div className="bg-white rounded-xl border border-zinc-200 p-4 md:p-8">

      <h1 className="text-2xl md:text-3xl font-semibold text-[#3347B0]">
        Meus chamados
      </h1>

      {/* DESKTOP */}
      <div className="hidden xl:block mt-8 overflow-x-auto">

        {tickets.length === 0 && (
          <p className="text-sm text-zinc-500">
            Nenhum chamado encontrado.
          </p>
        )}

        {tickets.length > 0 && (
          

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

  const totalValue =
    ticket.service.amount +
    ticket.additionalServices.reduce(
      (total, service) =>
        total + service.amount,
      0
    );

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

        <div>

          <p className="font-medium">
            {totalValue.toLocaleString(
              "pt-BR",
              {
                style: "currency",
                currency: "BRL",
              }
            )}
          </p>

          {ticket.additionalServices.length > 0 && (

            <span
              className="
                text-xs
                text-zinc-500
              "
            >
              +{ticket.additionalServices.length}
              {" "}
              adicional
              {ticket.additionalServices.length > 1 && "is"}
            </span>

          )}

        </div>

      </td>

      <td>

        <div className="flex items-center gap-2">

          {ticket.technician.avatarUrl ? (

            <img
              src={ `${API_URL}/uploads/${ticket.technician.avatarUrl}` }
              alt={ticket.technician.name}
              className="h-6 w-6 rounded-full"
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

          <span className="text-sm text-zinc-600">
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
            text-zinc-600
            w-8
            h-8
            flex
            items-center
            justify-center
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
        )}
        

      </div>

      {/* MOBILE */}
      <div className="xl:hidden mt-6 space-y-4">

        {tickets.length === 0 && (
          <p className="text-sm text-zinc-500">
            Nenhum chamado encontrado.
          </p>
        )}

        {tickets.map((ticket) => {

           const totalValue =
    ticket.service.amount +
    ticket.additionalServices.reduce(
      (total, service) =>
        total + service.amount,
      0
    );

          return(

          <div
            key={ticket.id}
            className="
              border
              border-zinc-200
              rounded-xl
              p-4
              bg-white
            "
          >

            <div className="flex justify-between items-start">

              <div>

                <p className="text-xs text-zinc-500">
                  {new Date(
                    ticket.createdAt
                  ).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>

                <h3 className="font-medium mt-1">
                  {ticket.title}
                </h3>

              </div>

              <Link
  to={`/ticket/${ticket.id}`}
  className="
    h-9
    w-9
    rounded-lg
    bg-zinc-100
    flex
    items-center
    justify-center
    hover:bg-zinc-200
    transition
  "
>
  <Eye size={16} />
</Link>

            </div>

            <div className="mt-4 space-y-3">

              <div>
                <p className="text-xs text-zinc-500">
                  Serviço
                </p>

                <p className="text-sm font-medium">
                  {ticket.service.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Valor
                </p>

                <p className="text-sm font-medium">
                  {totalValue.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}
                </p>
              </div>

              <div>

                <p className="text-xs text-zinc-500 mb-1">
                  Técnico
                </p>

                <div className="flex items-center gap-2">

                  {ticket.technician.avatarUrl ? (

                    <img
                      src={`${API_URL}/uploads/${ticket.technician.avatarUrl}`}
                      alt={ticket.technician.name}
                      className="h-7 w-7 rounded-full"
                    />

                  ) : (

                    <div
                      className="
                        h-7
                        w-7
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

                  <span className="text-sm">
                    {ticket.technician.name}
                  </span>

                </div>

              </div>

              <div>

                <p className="text-xs text-zinc-500 mb-1">
                  Status
                </p>

                {getStatusBadge(ticket.status)}

              </div>

            </div>

          </div>
          )
})}

      </div>

    </div>
  </AppLayout>
);

}
