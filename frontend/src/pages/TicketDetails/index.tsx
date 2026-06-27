import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { AppLayout } from "../../layouts/AppLayout";
import { api } from "../../services/api";

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

  additionalServices: {
    id: string;
    description: string;
    amount: number;
  }[];
}

export function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState<Ticket | null>(null);

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

  return(
  <AppLayout>
  <div className="space-y-6">

    <Link
      to="/tickets/my-tickets"
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

    <h1 className="text-4xl font-semibold text-[#3347B0]">
      Chamado detalhado
    </h1>

    <div className="grid grid-cols-12 gap-6">

      {/* CARD ESQUERDO */}
      <div className="col-span-12 lg:col-span-8">

        <div className="bg-white rounded-xl border border-zinc-200 p-6 h-full">

          <div className="flex items-start justify-between">

            <div>
              <span className="text-sm text-zinc-500">
                {ticket.id.slice(0, 5)}
              </span>

              <h2 className="text-2xl font-semibold mt-2">
                {ticket.title}
              </h2>
            </div>

            <span className="
  flex
  items-center
  gap-1
  bg-pink-100
  text-pink-600
  px-4
  py-1
  rounded-full
  text-sm
">
  {/* <CircleDot size={14}/> */}
  Aberto
</span>

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

        </div>

      </div>

      {/* CARD DIREITO */}
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

              <span>Preço base</span>

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

            <div className="mt-4">

              <p className="text-sm text-zinc-500 mb-2">
                Adicionais
              </p>

              {ticket.additionalServices.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  Nenhum serviço adicional
                </p>
              ) : (
                ticket.additionalServices.map(service => (
                  <div
                    key={service.id}
                    className="flex justify-between text-sm"
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

            <hr className="my-6" />

            <div className="flex justify-between font-semibold text-lg">

              <span>Total</span>

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