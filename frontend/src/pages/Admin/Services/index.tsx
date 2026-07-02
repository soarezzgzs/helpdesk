import { useEffect, useState } from "react";

import { AppLayout } from "../../../layouts/AppLayout";
import { api } from "../../../services/api";

import {
  Pencil,
  Plus,
  CircleCheck,
  CircleOff

} from "lucide-react";

import { CreateServiceModal } from "./CreateServiceModal";
import { EditServiceModal } from "./EditServiceModal";

interface Service {
  id: string;
  name: string;
  amount: number;
  active: boolean;
}

export function AdminServices() {

  const [services, setServices] =
    useState<Service[]>([]);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedServiceId, setSelectedServiceId] =
    useState("");

  async function loadServices() {

    try {

      const response =
        await api.get("/services");

      setServices(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  async function toggleStatus(
    serviceId: string
  ) {

    try {

      await api.patch(
        `/services/${serviceId}/status`
      );

      loadServices();

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

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

        <div className="flex justify-between items-center gap-4">

          <h1
            className="
              text-2xl
              md:text-3xl
              font-semibold
              text-[#3347B0]
            "
          >
            Serviços
          </h1>

          <button
  onClick={() =>
    setShowCreateModal(true)
  }
  className="
    flex
    items-center
    justify-center
    gap-2
    bg-zinc-900
    text-white
    h-10
    w-10
    md:w-auto
    md:px-4
    rounded-lg
  "
>
  <Plus size={16} />

  <span className="hidden md:inline">
    Novo
  </span>
</button>

        </div>

        <div className="mt-6 md:mt-8">

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
                  Título
                </th>

                <th className="pb-4">
                  Valor
                </th>

                <th className="pb-4">
                  Status
                </th>

                <th className="pb-4"></th>

              </tr>

            </thead>

            <tbody>

              {services.map(service => (

                <tr
                  key={service.id}
                  className="
                    border-b
                    border-zinc-200
                    hover:bg-zinc-50
                  "
                >

                  <td className="py-5 max-w-30">

  <span
    className="
      block
      truncate
    "
  >
    {service.name}
  </span>

</td>

                  <td>

                    {service.amount.toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}

                  </td>

                  <td>

                    <div className="flex items-center gap-3">

  <span
    className={`
      hidden md:inline-flex
      px-3
      py-1
      rounded-full
      text-xs

      ${
        service.active
          ? `
            bg-green-100
            text-green-700
          `
          : `
            bg-red-100
            text-red-600
          `
      }
    `}
  >
    {service.active
      ? "Ativo"
      : "Inativo"}
  </span>

  <div className="md:hidden">

    {service.active ? (

      <CircleCheck
        size={18}
        className="text-green-600"
      />

    ) : (

      <CircleOff
        size={18}
        className="text-red-600"
      />

    )}

  </div>

  <button
    onClick={() =>
      toggleStatus(service.id)
    }
    className="
    hidden
    md:block
      text-sm
      text-zinc-600
    "
  >
    {service.active
      ? "Desativar"
      : "Reativar"}
  </button>

</div>

                  </td>

                  <td>

                    <button
                      onClick={() => {

                        setSelectedServiceId(
                          service.id
                        );

                        setShowEditModal(true);

                      }}
                      className="
                        h-9
                        w-9
                        rounded
                        bg-zinc-100
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Pencil size={14} />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {showCreateModal && (

        <CreateServiceModal
          onClose={() =>
            setShowCreateModal(false)
          }
          onSuccess={loadServices}
        />

      )}

      {showEditModal && (

        <EditServiceModal
          serviceId={selectedServiceId}
          onClose={() =>
            setShowEditModal(false)
          }
          onSuccess={loadServices}
        />

      )}

    </AppLayout>
  );
}
