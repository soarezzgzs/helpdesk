import { useEffect, useState } from "react";

import { AppLayout } from "../../../layouts/AppLayout";
import { api, API_URL } from "../../../services/api";

import { EditClientModal } from "./EditClientModal";
import { DeleteClientModal } from "./DeleteClientModal";

import {
  Pencil,
  Trash2,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export function AdminClients() {

  const [clients, setClients] =
    useState<Client[]>([]);

  const [selectedClientId, setSelectedClientId] =
    useState("");

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  async function loadClients() {

    try {

      const response =
        await api.get("/clients/admin");

      setClients(response.data);

    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    loadClients();
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

      <h1
        className="
          text-2xl
          md:text-3xl
          font-semibold
          text-[#3347B0]
        "
      >
        Clientes
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
                Nome
              </th>

              <th className="pb-4">
                E-mail
              </th>

              <th className="pb-4"></th>

            </tr>

          </thead>

          <tbody>

            {clients.map(client => (

              <tr
                key={client.id}
                className="
                  border-b
                  border-zinc-200
                  hover:bg-zinc-50
                "
              >

                <td className="py-5">

                  <div className="flex items-center gap-3">

                    {client.avatarUrl ? (

                      <img
                        src={`${API_URL}/uploads/${client.avatarUrl}`}
                        alt={client.name}
                        className="
                          h-8
                          w-8
                          rounded-full
                          object-cover
                        "
                      />

                    ) : (

                      <div
                        className="
                          h-8
                          w-8
                          rounded-full
                          bg-blue-700
                          text-white
                          text-xs
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {client.name
                          .split(" ")
                          .map(word => word[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>

                    )}

                    <span>
                      {client.name}
                    </span>

                  </div>

                </td>

                <td>
                  {client.email}
                </td>

                <td>

                  <div className="flex justify-end gap-3">

                    <button
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setShowDeleteModal(true);
                      }}
                      className="
                        h-8
                        w-8
                        rounded
                        bg-red-50
                        text-red-500
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Trash2 size={14} />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedClientId(client.id);
                        setShowEditModal(true);
                      }}
                      className="
                        h-8
                        w-8
                        rounded
                        bg-zinc-100
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Pencil size={14} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MOBILE + TABLET */}
      

       {/* MOBILE + TABLET */}
<div className="xl:hidden mt-6 space-y-4">

  {clients.map(client => (

    <div
      key={client.id}
      className="
        border
        border-zinc-200
        rounded-xl
        p-4
      "
    >

      <div className="flex items-start gap-3">

        {client.avatarUrl ? (

          <img
            src={`${API_URL}/uploads/${client.avatarUrl}`}
            alt={client.name}
            className="
              h-10
              w-10
              rounded-full
              object-cover
              shrink-0
            "
          />

        ) : (

          <div
            className="
              h-10
              w-10
              rounded-full
              bg-blue-700
              text-white
              text-sm
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            {client.name
              .split(" ")
              .map(word => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>

        )}

        <div className="flex-1 min-w-0">

          <p className="font-medium">
            {client.name}
          </p>

          <p
            className="
              text-sm
              text-zinc-500
              break-all
            "
          >
            {client.email}
          </p>

        </div>

      </div>

      <div
        className="
          flex
          justify-end
          gap-3
          mt-4
        "
      >

        <button
          onClick={() => {
            setSelectedClientId(client.id);
            setShowDeleteModal(true);
          }}
          className="
            h-9
            w-9
            rounded-lg
            bg-red-50
            text-red-500
            flex
            items-center
            justify-center
          "
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={() => {
            setSelectedClientId(client.id);
            setShowEditModal(true);
          }}
          className="
            h-9
            w-9
            rounded-lg
            bg-zinc-100
            text-zinc-500
            flex
            items-center
            justify-center
          "
        >
          <Pencil size={16} />
        </button>

      </div>

    </div>

  ))}

</div>

    {showEditModal && (

      <EditClientModal
        clientId={selectedClientId}
        onClose={() =>
          setShowEditModal(false)
        }
        onSuccess={loadClients}
      />

    )}

    {showDeleteModal && (

      <DeleteClientModal
        clientId={selectedClientId}
        onClose={() =>
          setShowDeleteModal(false)
        }
        onSuccess={loadClients}
      />

    )}

    </div>

  </AppLayout>
);
}