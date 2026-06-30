import { api } from "../../../services/api";

interface Props {
  clientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteClientModal({
  clientId,
  onClose,
  onSuccess,
}: Props) {

  async function handleDelete() {

    await api.delete(
      `/clients/admin/${clientId}`
    );

    onSuccess();

    onClose();
  }

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
          p-6
        "
      >

        <div className="flex justify-between">

          <h2 className="font-semibold">
            Excluir cliente
          </h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        <p className="mt-6">
          Deseja realmente excluir este cliente?
        </p>

        <p
          className="
            mt-4
            text-sm
            text-zinc-500
          "
        >
          Ao excluir, todos os chamados
          deste cliente serão removidos e
          essa ação não poderá ser desfeita.
        </p>

        <div className="flex gap-3 mt-8">

          <button
            onClick={onClose}
            className="
              flex-1
              py-3
              rounded
              bg-zinc-100
            "
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            className="
              flex-1
              py-3
              rounded
              bg-zinc-900
              text-white
            "
          >
            Sim, excluir
          </button>

        </div>

      </div>

    </div>
  );
}