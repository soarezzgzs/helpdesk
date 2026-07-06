import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { AppLayout } from "../../layouts/AppLayout";
import { api } from "../../services/api";

import {useAuth} from "../../contexts/AuthContext"

import {ArrowLeft, Clock, CircleCheckBig, CircleQuestionMark ,Trash2} from "lucide-react"

interface Ticket {
  id: string;
  title: string;
  description: string;
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

  client: {
    name: string;
    avatarUrl: string | null;
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
  const [showAdditionalServiceModal, setShowAdditionalServiceModal] = useState(false);
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceAmount, setServiceAmount] = useState("");

  const {user} = useAuth()

  const isTechnician = user?.role === "technician";

  const isAdministrator = user?.role === "admin";

  const isClient = user?.role === "client";

  const backRoute = user?.role === "admin" ? "/tickets/admin" : user?.role === "technician" ? "/tickets/assigned" : "/tickets/my-tickets"

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
          bg-red-200
          text-red-100
          px-4 py-1
          rounded-full
          text-sm
          "
          >
          <CircleQuestionMark size={14} />
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
          px-4 py-1
          rounded-full
          text-sm
          "
          >
          <Clock size={14} />
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
          px-4 py-1
            rounded-full
            text-sm
          "
          >
          <CircleCheckBig size={14} />
          Encerrado
        </span>
      );
      
      default:
        return null;
      }
    }

    async function handleDeleteAdditionalService(
  additionalServiceId: string
) {
  try {

    await api.delete(
      `/tickets/additional-services/${additionalServiceId}`
    );

    loadTicket();

  } catch (error) {
    console.log(error);
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

async function handleAddAdditionalService() {
  try {

    await api.post(
      `/tickets/additional-services/${ticket?.id}`,
      {
        description: serviceDescription,
        amount: Number(serviceAmount)
      }
    );



    setShowAdditionalServiceModal(false);

    setServiceDescription("");

    setServiceAmount("");

    loadTicket();

  } catch (error) {
    console.log(error);
  }
}


  return (

    <>
    {showAdditionalServiceModal && (

  <div
    className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
      z-50
    "
  >

    <div
      className="
        bg-white
        rounded-xl
        w-full
        max-w-md
        p-6
      "
    >

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-semibold">
          Serviço adicional
        </h2>

        <button
          onClick={() =>
            setShowAdditionalServiceModal(false)
          }
        >
          ✕
        </button>

        

      </div>

      <div className="mt-6">

        <label
          className="
            text-xs
            text-zinc-500
            uppercase
          "
        >
          Descrição
        </label>

        <input
          value={serviceDescription}
          onChange={(e) =>
            setServiceDescription(
              e.target.value
            )
          }
          className="
            w-full
            border-b
            py-2
            outline-none
            mt-2
          "
        />
        

      </div>

      <div className="mt-6">

        <label
          className="
            text-xs
            text-zinc-500
            uppercase
          "
        >
          Valor
        </label>

        <input
          type="number"
          value={serviceAmount}
          onChange={(e) =>
            setServiceAmount(
              e.target.value
            )
          }
          className="
            w-full
            border-b
            py-2
            outline-none
            mt-2
          "
        />

      </div>

      {ticket.status !== "closed" && (
        <button
        onClick={handleAddAdditionalService}
        className="
          w-full
          mt-8
          bg-zinc-900
          text-white
          py-3
          rounded
          hover:bg-zinc-800
        "
      >
        Salvar
      </button>
      )}

    </div>

  </div>

)}

  <AppLayout>
    <div className="space-y-6">

      <div className="flex  items-center justify-between flex-wrap gap-4">

        <div>

          <Link
            to={backRoute}
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

          <h1 className="text-3xl font-semibold text-[#3347B0] mt-4 mb-4 w-full">
            Chamado detalhado
          </h1>

        </div>


        {(isTechnician || isAdministrator) && (

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

            <div className="flex flex-col justify-between">

              <div>

                <div className="flex items-center justify-between gap-2 w-full" >

                <span className="text-sm text-zinc-500">
                  {ticket.id.slice(0, 5)}
                </span>
              {getStatusBadge(ticket.status) }

                </div>

                <h2 className="text-2xl font-semibold mt-2 mb-2">
                  {ticket.title}
                </h2>

              </div>


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
  onClick={() =>
    setShowAdditionalServiceModal(true)
  }
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

    <div className="flex items-center gap-4">

      <span>
        {service.amount.toLocaleString(
          "pt-BR",
          {
            style: "currency",
            currency: "BRL"
          }
        )}
      </span>

      <button
        onClick={() =>
          handleDeleteAdditionalService(
            service.id
          )
        }
        className="
          h-8
          w-8
          rounded
          bg-red-50
          text-red-500
          flex
          items-center
          justify-center
          hover:bg-red-100
        "
      >
        <Trash2 size={16} />
      </button>

    </div>

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

              {ticket.technician.avatarUrl ? (

  <img
    src={`http://localhost:3333/uploads/${ticket.technician.avatarUrl}`}
    alt={ticket.technician.name}
    className="
      h-10
      w-10
      rounded-full
      object-cover
    "
  />

) : (

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

)}

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

              <div className="flex justify-between mt-4">

  <span>
    Adicionais
  </span>

  <span>
    {additionalServicesTotal.toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
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

  </>
);
}
