import { useEffect, useState } from "react";

import { api } from "../../../services/api";

interface Props {
  serviceId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditServiceModal({
  serviceId,
  onClose,
  onSuccess,
}: Props) {

  const [name, setName] =
    useState("");

  const [amount, setAmount] =
    useState("");

  async function loadService() {

    try {

      const response =
        await api.get(
          `/services/${serviceId}`
        );

      setName(response.data.name);

      setAmount(
        String(response.data.amount)
      );

    } catch (error) {
      console.log(error);
    }
  }

  async function handleSave() {

    try {

      await api.put(
        `/services/${serviceId}`,
        {
          name,
          amount: Number(amount),
        }
      );

      onSuccess();

      onClose();

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadService();
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
            flex
            justify-between
            p-6
            border-b
          "
        >

          <h2 className="font-semibold">
            Serviço
          </h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        <div className="p-6">

          <label
            className="
              text-xs
              text-zinc-500
            "
          >
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
              outline-none
            "
          />

          <div className="mt-6">

            <label
              className="
                text-xs
                text-zinc-500
              "
            >
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
              hover:bg-zinc-800
            "
          >
            Salvar
          </button>

        </div>

      </div>

    </div>
  );
}