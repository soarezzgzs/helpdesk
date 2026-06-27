import { useState } from "react";

import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps) {

  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  async function handleSave() {
    try {

      const endpoint =
        user?.role === "technician"
          ? `/technicians/password/${user.id}`
          : `/clients/password/${user?.id}`;

      await api.patch(endpoint, {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      alert("Senha alterada com sucesso!");

      onClose();

    } catch (error) {
      console.log(error);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-[60]
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
            Alterar senha
          </h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        <div className="mt-6">

          <label
            className="
              text-xs
              uppercase
              text-zinc-500
            "
          >
            Senha atual
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
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
              uppercase
              text-zinc-500
            "
          >
            Nova senha
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
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

        <button
          onClick={handleSave}
          className="
            w-full
            mt-8
            bg-zinc-900
            text-white
            py-3
            rounded-lg
            hover:bg-zinc-800
          "
        >
          Salvar
        </button>

      </div>
    </div>
  );
}