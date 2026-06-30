import { useEffect, useState } from "react";

import { AppLayout } from "../../../layouts/AppLayout";
import { api } from "../../../services/api";

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
          Clientes
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
                          src={`http://localhost:3333/uploads/${client.avatarUrl}`}
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

    </AppLayout>
  );
}