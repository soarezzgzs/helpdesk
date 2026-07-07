import { useEffect, useState } from "react";

import { AppLayout } from "../../layouts/AppLayout";
import { api, API_URL } from "../../services/api";

import {
  Pencil,
  PlayCircle,
  CheckCircle,
  CircleQuestionMark,
  Clock
} from "lucide-react";

import { Link } from "react-router-dom";

interface Ticket {
  id: string;
  title: string;
  status: string;
  createdAt: string;

  client: {
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

export function Technician() {

  const [tickets, setTickets] = useState<Ticket[]>([]);

  async function loadTickets() {
    try {

      const response = await api.get(
        "/tickets/assigned"
      );

      setTickets(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  async function updateStatus(
    ticketId: string,
    status: string
  ) {
    try {

      await api.patch(
        `/tickets/${ticketId}/status`,
        {
          status
        }
      );

      loadTickets();

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  const openTickets = tickets.filter(
    ticket => ticket.status === "open"
  );

  const inProgressTickets = tickets.filter(
    ticket => ticket.status === "in_progress"
  );

  const closedTickets = tickets.filter(
    ticket => ticket.status === "closed"
  );

  function TicketCard({
    ticket,
  }: {
    ticket: Ticket;
  }) {

    const totalValue = ticket.service.amount + ticket.additionalServices.reduce((total, service) => total + service.amount, 0);

    return (
      <div
        className="
          bg-white
          border
          border-zinc-200
          rounded-xl
          p-4
          w-[320px]
        "
      >

        <div className="flex justify-between items-start">

          <span className="text-xs text-zinc-500">
            {ticket.id.slice(0, 5)}
          </span>

          <div className="flex gap-2">

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
              <Pencil size={14} />
            </Link>

            {ticket.status === "open" && (
              <button
                onClick={() =>
                  updateStatus(
                    ticket.id,
                    "in_progress"
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  bg-zinc-900
                  text-white
                  px-3
                  py-2
                  rounded
                  text-xs
                "
              >
                <PlayCircle size={14} />
                Iniciar
              </button>
            )}

            {ticket.status === "in_progress" && (
              <button
                onClick={() =>
                  updateStatus(
                    ticket.id,
                    "closed"
                  )
                }
                className="
                  flex
                  items-center
                  gap-2
                  bg-zinc-900
                  text-white
                  px-3
                  py-2
                  rounded
                  text-xs
                "
              >
                <CheckCircle size={14} />
                Encerrar
              </button>
            )}

          </div>

        </div>

        <h3 className="font-semibold mt-4">
          {ticket.title}
        </h3>

        <p className="text-sm text-zinc-500">
          {ticket.service.name}
        </p>

        <div className="flex justify-between mt-6">

          <span className="text-sm text-zinc-500">
            {new Date(
              ticket.createdAt
            ).toLocaleDateString("pt-BR")}
          </span>

          <div className="text-right">

  <p className="font-semibold">
    {totalValue.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    )}
  </p>


</div>

        </div>

        <div
          className="
            mt-6
            pt-4
            border-t
            flex
            items-center
            justify-between
          "
        >

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

            <span className="text-sm">
              {ticket.client.name}
            </span>

          </div>

          {ticket.status === "open" && (
            <div
              className="
                h-8
                w-8
                rounded-full
                bg-red-200
                flex
                items-center
                justify-center
              "
            >
              <CircleQuestionMark
                size={16}
                className="text-red-100"
              />
            </div>
          )}

          {ticket.status === "in_progress" && (
            <div
              className="
                h-8
                w-8
                rounded-full
                bg-blue-200
                flex
                items-center
                justify-center
              "
            >
              <Clock
                size={16}
                className="text-blue-100"
              />
            </div>
          )}

          {ticket.status === "closed" && (
            <div
              className="
                h-8
                w-8
                rounded-full
                bg-green-200
                flex
                items-center
                justify-center
              "
            >
              <CheckCircle
                size={16}
                className="text-green-100"
              />
            </div>
          )}

        </div>

      </div>
    );
  }

  return (
    <AppLayout>

      <h1 className="text-4xl font-semibold text-[#3347B0]">
        Meus chamados
      </h1>

      {/* Em atendimento */}
      <div className="mt-8">

        <span
          className="
            bg-blue-200
            text-blue-100
            px-4
            py-1
            rounded-full
            text-sm
            font-medium
          "
        >
          Em atendimento
        </span>

        <div className="flex flex-wrap gap-4 mt-4">

          {inProgressTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
            />
          ))}

        </div>

      </div>

      {/* Aberto */}
      <div className="mt-10">

        <span
          className="
            bg-red-200
            text-red-100
            px-4
            py-1
            rounded-full
            text-sm
            font-medium
          "
        >
          Aberto
        </span>

        <div className="flex flex-wrap gap-4 mt-4">

          {openTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
            />
          ))}

        </div>

      </div>

      {/* Encerrado */}
      <div className="mt-10">

        <span
          className="
            bg-green-200
            text-green-100
            px-4
            py-1
            rounded-full
            text-sm
            font-medium
          "
        >
          Encerrado
        </span>

        <div className="flex flex-wrap gap-4 mt-4">

          {closedTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
            />
          ))}

        </div>

      </div>

    </AppLayout>
  );
}