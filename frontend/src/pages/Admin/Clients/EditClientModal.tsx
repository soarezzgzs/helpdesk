import { useEffect, useState } from "react";

import { api, API_URL } from "../../../services/api";

interface Props {
  clientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditClientModal({
  clientId,
  onClose,
  onSuccess,
}: Props) {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [avatarUrl, setAvatarUrl] =
    useState<string | null>(null);

  async function loadClient() {

    const response =
      await api.get(
        `/clients/admin/${clientId}`
      );

    setName(response.data.name);

    setEmail(response.data.email);

    setAvatarUrl(
      response.data.avatarUrl
    );
  }

  async function handleSave() {

    await api.put(
      `/clients/${clientId}`,
      {
        name,
        email,
      }
    );

    onSuccess();

    onClose();
  }

  useEffect(() => {
    loadClient();
  }, []);

  return (
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
        "
      >

        <div
          className="
            p-6
            border-b
          "
        >

          <div className="flex justify-between">

            <h2 className="font-semibold">
              Cliente
            </h2>

            <button onClick={onClose}>
              ✕
            </button>

          </div>

        </div>

        <div className="p-6">

          <div className="flex justify-start mb-6">

            {avatarUrl ? (

              <img
                src={`${API_URL}/uploads/${avatarUrl}`}
                alt={name}
                className="
                  h-16
                  w-16
                  rounded-full
                  object-cover
                "
              />

            ) : (

              <div
                className="
                  h-16
                  w-16
                  rounded-full
                  bg-blue-700
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >
                {name
                  .split(" ")
                  .map(word => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

            )}

          </div>

          <label className="text-xs text-zinc-500">
            NOME
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
              w-full
              border-b
              py-3
              outline-none
            "
          />

          <div className="mt-6">

            <label className="text-xs text-zinc-500">
              E-MAIL
            </label>

            <input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="
                w-full
                border-b
                py-3
                outline-none
              "
            />

          </div>

          <button
            onClick={handleSave}
            className="
              w-full
              mt-8
              bg-zinc-900
              text-white
              py-3
              rounded
            "
          >
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}