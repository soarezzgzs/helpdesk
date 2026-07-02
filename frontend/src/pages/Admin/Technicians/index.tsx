import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AppLayout } from "../../../layouts/AppLayout";
import { api } from "../../../services/api";

import {
  Pencil,
  Plus,
} from "lucide-react";

interface Availability {
  hour: string;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  availability: Availability[];
}

export function AdminTechnicians() {

  const [technicians, setTechnicians] =
    useState<Technician[]>([]);

  async function loadTechnicians() {
    try {

      const response =
        await api.get("/technicians/admin");

      setTechnicians(response.data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadTechnicians();
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
            Técnicos
          </h1>

          <Link
  to={"/technicians/admin/new"}
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
          </Link>

        </div>

        <div className="mt-8">

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

                <th className="hidden md:table-cell pb-4">
                  E-mail
                </th>

                <th className="pb-4">
                  Disponibilidade
                </th>

                <th className="pb-4"></th>

              </tr>

            </thead>

            <tbody>

              {technicians.map(
                technician => (
                  <tr
                    key={technician.id}
                    className="
                      border-b
                      border-zinc-200
                      hover:bg-zinc-50
                      transition
                    "
                  >

                    <td className="py-5">

                      <div className="flex items-center gap-3">

                        {technician.avatarUrl ? (

                          <img
                            src={`http://localhost:3333/uploads/${technician.avatarUrl}`}
                            alt={technician.name}
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
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-semibold
                            "
                          >
                            {technician.name
                              .split(" ")
                              .map(
                                word => word[0]
                              )
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </div>

                        )}

                        <span className="font-medium">
                          {technician.name}
                        </span>

                      </div>

                    </td>

                    <td className="hidden md:table-cell">
                      {technician.email}
                    </td>

                    <td>

                      <div className="flex flex-wrap gap-2">

                        {technician.availability
                          ?.slice(0, 1)
                          .map(hour => (

                            <span
                              key={hour.hour}
                              className="
                                px-3
                                py-1
                                rounded-full
                                border
                                border-zinc-300
                                text-xs
                                text-zinc-600
                              "
                            >
                              {hour.hour}
                            </span>

                          ))}

                        {technician
                          .availability
                          ?.length > 4 && (

                          <span
                            className="
                              px-3
                              py-1
                              rounded-full
                              border
                              border-zinc-300
                              text-xs
                              text-zinc-500
                            "
                          >
                            +
                            {technician.availability.length - 4}
                          </span>

                        )}

                      </div>

                    </td>

                    <td>

                      <Link
                        to={`/technicians/admin/edit/${technician.id}`}
                        className="
                          h-7
                          w-7
                          md:w-8
                          md:h-8
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
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </AppLayout>
  );
}