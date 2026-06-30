import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AppLayout } from "../../layouts/AppLayout";
import { api } from "../../services/api";

import {
  Pencil,
  CircleDot,
  CheckCircle,
} from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  status: string;
  createdAt: string;

  client: {
    name: string;
    avatarUrl: string | null;
  };

  technician: {
    name: string;
    avatarUrl: string | null;
  };

  service: {
    name: string;
    amount: number;
  };

  additionalServices: {
    amount: number;
  }[];
}

export function Admin() {
  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  async function loadTickets() {
    try {
      const response =
        await api.get("/tickets/admin");

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
          <span
            className="
              flex items-center gap-2
              bg-pink-100
              text-pink-600
              px-3 py-1
              rounded-full
              text-xs
              font-medium
            "
          >
            <CircleDot size={14} />
            Aberto
          </span>
        );

      case "in_progress":
        return (
          <span
            className="
              flex items-center gap-2
              bg-blue-100
              text-blue-600
              px-3 py-1
              rounded-full
              text-xs
              font-medium
            "
          >
            <CircleDot size={14} />
            Em atendimento
          </span>
        );

      case "closed":
        return (
          <span
            className="
              flex items-center gap-2
              bg-green-100
              text-green-600
              px-3 py-1
              rounded-full
              text-xs
              font-medium
            "
          >
            <CheckCircle size={14} />
            Encerrado
          </span>
        );

      default:
        return null;
    }
  }

  return (
    <AppLayout>

      <div
        className="
          bg-white
          rounded-xl
          border
          border-zinc-200
          p-8
        "
      >

        <h1
          className="
            text-3xl
            font-semibold
            text-[#3347B0]
          "
        >
          Chamados
        </h1>

        <div className="mt-8 overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr
                className="
                  border-b
                  text-left
                  text-sm
                  text-zinc-500
                "
              >

                <th className="pb-4">
                  Atualizado em
                </th>

                <th className="pb-4">
                  Id
                </th>

                <th className="pb-4">
                  Título e Serviço
                </th>

                <th className="pb-4">
                  Valor total
                </th>

                <th className="pb-4">
                  Cliente
                </th>

                <th className="pb-4">
                  Técnico
                </th>

                <th className="pb-4">
                  Status
                </th>

                <th className="pb-4"></th>

              </tr>

            </thead>

            <tbody>

              {tickets.map(ticket => {

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
                    className="
                      border-b
                      border-zinc-200
                    "
                  >

                    <td className="py-5 text-sm text-zinc-600">

                      {new Date(
                        ticket.createdAt
                      ).toLocaleDateString(
                        "pt-BR"
                      )}

                    </td>

                    <td className="text-sm font-medium">
                      #{ticket.id.slice(0, 5)}
                    </td>

                    <td>

                      <div>

                        <p className="font-medium">
                          {ticket.title}
                        </p>

                        <p
                          className="
                            text-sm
                            text-zinc-500
                          "
                        >
                          {ticket.service.name}
                        </p>

                      </div>

                    </td>

                    <td>

                      {totalValue.toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}

                    </td>

                    <td>

                      <div className="flex items-center gap-2">

                        {ticket.client.avatarUrl ? (

                          <img
                            src={`http://localhost:3333/uploads/${ticket.client.avatarUrl}`}
                            alt={ticket.client.name}
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
                            {ticket.client.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                        )}

                        <span>
                          {ticket.client.name}
                        </span>

                      </div>

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

                    <td className="py-5 pr-5 text-sm text-zinc-600">
                      {getStatusBadge(
                        ticket.status
                      )}
                    </td>

                    <td>

                      <Link
                        to={`/ticket/${ticket.id}`}
                        className="
                          h-8
                          w-8
                          rounded
                          bg-zinc-100
                          hover:bg-zinc-200
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Pencil size={15} />
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
