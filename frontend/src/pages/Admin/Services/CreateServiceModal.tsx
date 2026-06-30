import { useState } from "react";

import { api } from "../../../services/api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateServiceModal({
  onClose,
  onSuccess,
}: Props) {

  const [name, setName] =
    useState("");

  const [amount, setAmount] =
    useState("");

  async function handleSave() {

    await api.post(
      "/services/admin",
      {
        name,
        amount: Number(amount),
      }
    );

    onSuccess();

    onClose();
  }

  return (
    <div
      className="
        fixed inset-0
        bg-black/40
        flex
        items-center
        justify-center
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
            flex
            justify-between
            p-6
            border-b
          "
        >

          <h2>
            Cadastro de serviço
          </h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        <div className="p-6">

          <label className="text-xs">
            TÍTULO
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
            "
          />

          <div className="mt-6">

            <label className="text-xs">
              VALOR
            </label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="
                w-full
                border-b
                py-3
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
``