import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { AppLayout } from "../../layouts/AppLayout";
import { api } from "../../services/api";

import {useAuth} from "../../contexts/AuthContext"

import {ArrowLeft, CircleDot} from "lucide-react"

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;

  technician: {
    name: string;
  };

  service: {
    name: string;
    amount: number;
  };

  client: {
    name: string;
  }

  additionalServices: {
    id: string;
    description: string;
    amount: number;
  }[];
}

export function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState<Ticket | null>(null);

  const {user} = useAuth()

  const isTechnician = user?.role === "technician";

  const isClient = user?.role === "client";

  async function loadTicket() {
    try {
      const response = await api.get(`/tickets/${id}`);

      setTicket(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadTicket();
  }, []);

  if (!ticket) {
    return (
      <AppLayout>
        <p>Carregando...</p>
      </AppLayout>
    );
  }

  const additionalServicesTotal =
    ticket.additionalServices.reduce(
      (total, service) => total + service.amount,
      0
    );

  const totalValue =
    ticket.service.amount +
    additionalServicesTotal;

    function getStatusBadge(status: string) {
  switch (status) {
    case "open":
      return (
        <span
          className="
            flex items-center gap-2
            bg-pink-100
            text-pink-600
            px-4 py-1
            rounded-full
            text-sm
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
            px-4 py-1
            rounded-full
            text-sm
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
            px-4 py-1
            rounded-full
            text-sm
          "
        >
          <CircleDot size={14} />
          Encerrado
        </span>
      );

    default:
      return null;
  }
}

async function startAttendance() {
  try {

    await api.patch(
      `/tickets/${ticket?.id}/status`,
      {
        status: "in_progress"
      }
    );

    loadTicket();

  } catch (error) {
    console.log(error);
  }
}

async function closeTicket() {
  try {

    await api.patch(
      `/tickets/${ticket?.id}/status`,
      {
        status: "closed"
      }
    );

    loadTicket();

  } catch (error) {
    console.log(error);
  }
}

  return (
  <AppLayout>
    <div className="space-y-6">

      <div className="flex items-start justify-between">

        <div>

          <Link
            to={
              isTechnician
                ? "/tickets/assigned"
                : "/tickets/my-tickets"
            }
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-zinc-500
              hover:text-[#3347B0]
            "
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <h1 className="text-4xl font-semibold text-[#3347B0] mt-4">
            Chamado detalhado
          </h1>

        </div>

        {isTechnician && (

          <div className="flex gap-3">

            {ticket.status !== "closed" && (
              <button
                onClick={closeTicket}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-zinc-200
                  text-zinc-800
                  hover:bg-zinc-300
                "
              >
                Encerrar
              </button>
            )}

            {ticket.status === "open" && (
              <button
                onClick={startAttendance}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-zinc-900
                  text-white
                  hover:bg-zinc-800
                "
              >
                Iniciar atendimento
              </button>
            )}

          </div>

        )}

      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* ESQUERDA */}
        <div className="col-span-12 lg:col-span-8">

          <div className="bg-white rounded-xl border border-zinc-200 p-6">

            <div className="flex justify-between items-start">

              <div>

                <span className="text-sm text-zinc-500">
                  {ticket.id.slice(0, 5)}
                </span>

                <h2 className="text-2xl font-semibold mt-2">
                  {ticket.title}
                </h2>

              </div>

              {getStatusBadge(ticket.status)}

            </div>

            <div className="mt-8">

              <p className="text-sm text-zinc-500 mb-2">
                Descrição
              </p>

              <p className="text-zinc-700">
                {ticket.description}
              </p>

            </div>

            <div className="mt-8">

              <p className="text-sm text-zinc-500 mb-2">
                Categoria
              </p>

              <p>
                {ticket.service.name}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-8 mt-10">

              <div>

                <p className="text-sm text-zinc-500">
                  Criado em
                </p>

                <p>
                  {new Date(
                    ticket.createdAt
                  ).toLocaleDateString("pt-BR")}
                </p>

              </div>

              <div>

                <p className="text-sm text-zinc-500">
                  Atualizado em
                </p>

                <p>
                  {new Date(
                    ticket.createdAt
                  ).toLocaleDateString("pt-BR")}
                </p>

              </div>

            </div>

            <div className="mt-10">

              <p className="text-sm text-zinc-500">
                Cliente
              </p>

              <div className="flex items-center gap-2 mt-2">

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

                <span>
                  {ticket.client.name}
                </span>

              </div>

            </div>

          </div>

          {isTechnician && (

            <div
              className="
                bg-white
                rounded-xl
                border
                border-zinc-200
                p-6
                mt-6
              "
            >

              <div className="flex items-center justify-between">

                <p className="text-sm text-zinc-500">
                  Serviços adicionais
                </p>

                <button
                  className="
                    h-8
                    w-8
                    rounded
                    bg-zinc-900
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-zinc-800
                  "
                >
                  +
                </button>

              </div>

              <div className="mt-6">

                {ticket.additionalServices.length === 0 ? (

                  <p className="text-sm text-zinc-500">
                    Nenhum serviço adicional.
                  </p>

                ) : (

                  ticket.additionalServices.map(service => (

                    <div
                      key={service.id}
                      className="
                        flex
                        justify-between
                        items-center
                        py-4
                        border-b
                      "
                    >

                      <span>
                        {service.description}
                      </span>

                      <span>
                        {service.amount.toLocaleString(
                          "pt-BR",
                          {
                            style: "currency",
                            currency: "BRL"
                          }
                        )}
                      </span>

                    </div>

                  ))

                )}

              </div>

            </div>

          )}

        </div>

        {/* DIREITA */}
        <div className="col-span-12 lg:col-span-4">

          <div className="bg-white rounded-xl border border-zinc-200 p-6">

            <p className="text-sm text-zinc-500 mb-4">
              Técnico responsável
            </p>

            <div className="flex items-center gap-3">

              <div
                className="
                  h-10
                  w-10
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-semibold
                "
              >
                {ticket.technician.name
                  .split(" ")
                  .map(word => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <div>

                <p className="font-medium">
                  {ticket.technician.name}
                </p>

                <p className="text-sm text-zinc-500">
                  Técnico atribuído
                </p>

              </div>

            </div>

            <div className="mt-10">

              <p className="text-sm text-zinc-500 mb-4">
                Valores
              </p>

              <div className="flex justify-between">

                <span>
                  Preço base
                </span>

                <span>
                  {ticket.service.amount.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL"
                    }
                  )}
                </span>

              </div>

              <hr className="my-6" />

              <div className="flex justify-between font-semibold text-lg">

                <span>
                  Total
                </span>

                <span>
                  {totalValue.toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL"
                    }
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  </AppLayout>
);
}