import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AppLayout } from "../../layouts/AppLayout";
import { api, API_URL } from "../../services/api";

import {
  Pencil,
  CheckCircle,
  Clock,
  CircleQuestionMark,
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
              bg-red-200
              text-red-100
              px-3 py-1
              rounded-full
              text-xs
              font-medium
            "
          >
            <Clock size={14} />
            Aberto
          </span>
        );

      case "in_progress":
        return (
          <span
            className="
              flex items-center gap-2
              bg-blue-200
              text-blue-100
              px-3 py-1
              rounded-full
              text-xs
              font-medium
            "
          >
            <CircleQuestionMark size={14} />
            Em atendimento
          </span>
        );

      case "closed":
        return (
          <span
            className="
              flex items-center gap-2
              bg-green-200
              text-green-100
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
        p-4
        md:p-8
      "
    >

      <h1
        className="
          text-2xl
          md:text-3xl
          font-semibold
          text-[#3347B0]
        "
      >
        Chamados
      </h1>

      {/* DESKTOP */}
      <div className="hidden xl:block mt-8 overflow-x-auto">

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
                          src={`${API_URL}/uploads/${ticket.client.avatarUrl}`}
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
                          src={`${API_URL}/uploads/${ticket.technician.avatarUrl}`}
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
                        h-9
                        w-9
                        rounded-lg
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

      {/* MOBILE + TABLET */}
      <div className="xl:hidden mt-6 space-y-4">

        {tickets.map(ticket => {

          const totalValue =
            ticket.service.amount +
            ticket.additionalServices.reduce(
              (total, service) =>
                total + service.amount,
              0
            );

          return (

            <div
              key={ticket.id}
              className="
                border
                border-zinc-200
                rounded-xl
                p-4
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
                  "
                >
                  <Pencil size={16} />
                </Link>

              </div>

              <div className="mt-4">

                <p className="text-xs text-zinc-500">
                  Serviço
                </p>

                <p className="text-sm font-medium">
                  {ticket.service.name}
                </p>

              </div>

              <div className="mt-4">

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

              <div className="mt-4">
                {getStatusBadge(ticket.status)}
              </div>

            </div>

          );

        })}

      </div>

    </div>

  </AppLayout>
);
}
