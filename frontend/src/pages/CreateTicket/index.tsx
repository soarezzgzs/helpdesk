import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ArrowLeft } from "lucide-react";

import { AppLayout } from "../../layouts/AppLayout";
import { api } from "../../services/api";

const createTicketSchema = z.object({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres"),

  description: z
    .string()
    .min(3, "A descrição deve ter pelo menos 3 caracteres"),

  serviceId: z
    .string()
    .min(1, "Selecione um serviço"),
});

type CreateTicketSchema = z.infer<
  typeof createTicketSchema
>;

interface Service {
  id: string;
  name: string;
  amount: number;
}

export function CreateTicket() {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateTicketSchema>({
    resolver: zodResolver(createTicketSchema),
  });

  async function loadServices() {
    try {
      const response = await api.get("/services");

      setServices(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  const selectedService = services.find(
    (service) =>
      service.id === watch("serviceId")
  );

  async function handleCreateTicket(
    data: CreateTicketSchema
  ) {
    try {
      await api.post(
        "/tickets/create-ticket",
        data
      );

      navigate("/tickets/my-tickets");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">

        <Link
          to="/tickets/my-tickets"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-zinc-500
            hover:text-[#3347B0]
          "
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <h1 className="text-4xl font-semibold text-[#3347B0]">
          Novo chamado
        </h1>

        <form
          onSubmit={handleSubmit(
            handleCreateTicket
          )}
          className="
            grid
            grid-cols-12
            gap-6
          "
        >

          {/* Card Principal */}
          <div className="col-span-12 lg:col-span-8">

            <div className="bg-white rounded-xl border border-zinc-200 p-6">

              <h2 className="font-semibold">
                Informações
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Descreva o problema para abrir o
                chamado.
              </p>

              <div className="mt-8 space-y-6">

                <div>

                  <label className="block text-xs text-zinc-500 mb-2 uppercase">
                    Título
                  </label>

                  <input
                    type="text"
                    placeholder="Digite um título para o chamado"
                    {...register("title")}
                    className="
                      w-full
                      border-b
                      border-zinc-300
                      py-2
                      outline-none
                    "
                  />

                  {errors.title && (
                    <p className="text-red-500 text-xs mt-2">
                      {
                        errors.title.message
                      }
                    </p>
                  )}

                </div>

                <div>

                  <label className="block text-xs text-zinc-500 mb-2 uppercase">
                    Descrição
                  </label>

                  <textarea
                    rows={5}
                    placeholder="Descreva o problema"
                    {...register(
                      "description"
                    )}
                    className="
                      w-full
                      border-b
                      border-zinc-300
                      resize-none
                      py-2
                      outline-none
                    "
                  />

                  {errors.description && (
                    <p className="text-red-500 text-xs mt-2">
                      {
                        errors.description
                          .message
                      }
                    </p>
                  )}

                </div>

                <div>

                  <label className="block text-xs text-zinc-500 mb-2 uppercase">
                    Categoria de serviço
                  </label>

                  <select
                    {...register("serviceId")}
                    className="
                      w-full
                      border-b
                      border-zinc-300
                      py-2
                      outline-none
                    "
                  >
                    <option value="">
                      Selecione um serviço
                    </option>

                    {services.map(
                      (service) => (
                        <option
                          key={service.id}
                          value={service.id}
                        >
                          {service.name}
                        </option>
                      )
                    )}
                  </select>

                  {errors.serviceId && (
                    <p className="text-red-500 text-xs mt-2">
                      {
                        errors.serviceId
                          .message
                      }
                    </p>
                  )}

                </div>

              </div>

            </div>

          </div>

          {/* Card Resumo */}
          <div className="col-span-12 lg:col-span-4">

            <div className="bg-white rounded-xl border border-zinc-200 p-6">

              <h2 className="font-semibold">
                Resumo
              </h2>

              <p className="text-sm text-zinc-500">
                Valores e detalhes
              </p>

              <div className="mt-8 space-y-4">

                <div>

                  <p className="text-xs text-zinc-500">
                    Categoria de serviço
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedService?.name ??
                      "-"}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-zinc-500">
                    Custo inicial
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedService
                      ? selectedService.amount.toLocaleString(
                          "pt-BR",
                          {
                            style:
                              "currency",
                            currency:
                              "BRL",
                          }
                        )
                      : "R$ 0,00"}
                  </p>

                </div>

                <div className="pt-4 border-t">

                  <p className="text-xs text-zinc-500">
                    O chamado será automaticamente
                    atribuído a um técnico
                    disponível.
                  </p>

                </div>

                <button
                  type="submit"
                  className="
                    w-full
                    h-11
                    rounded
                    bg-zinc-900
                    text-white
                    hover:bg-zinc-800
                    transition
                  "
                >
                  Criar chamado
                </button>

              </div>

            </div>

          </div>

        </form>

      </div>
    </AppLayout>
  );
}
