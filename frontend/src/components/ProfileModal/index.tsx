import { useEffect, useRef, useState } from "react";

import { api } from "../../services/api";
import {useAuth} from "../../contexts/AuthContext"
import { ChangePasswordModal } from "../ChangePasswordModal";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}

export function ProfileModal({
  isOpen,
  onClose,
}: ProfileModalProps) {

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [name, setName] = useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [selectedHours, setSelectedHours] = useState<string[]>([]);

    const {user, updateUser} = useAuth();

    const availableHours = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

  async function loadProfile() {
  try {

    const response =
      await api.get("/profile");

    setProfile(response.data);

    setName(response.data.name);

    if (
      response.data.role ===
      "technician"
    ) {

      const availabilityResponse =
        await api.get(
          `/technicians/availability/${response.data.id}`
        );

      setSelectedHours(
        availabilityResponse.data.map(
          (item: any) => item.hour
        )
      );
    }

  } catch (error) {
    console.log(error);
  }
}

  async function handleSave() {
  try {

    if (selectedFile) {

      const formData =
        new FormData();

      formData.append(
        "avatar",
        selectedFile
      );

      await api.patch(
        "/profile/avatar",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );
    }

    await api.patch(
      "/profile",
      {
        name,
      }
    );

    if (
  user?.role === "technician"
) {

  await api.patch(
    `/technicians/availability/${user.id}`,
    {
      hours: selectedHours,
    }
  );
}

    const updatedProfile =
  await api.get("/profile");

setProfile(updatedProfile.data);

updateUser(updatedProfile.data);

setSelectedFile(null);

onClose();

  } catch (error) {
    console.log(error);
  }
}

function toggleHour(hour: string) {

  if (selectedHours.includes(hour)) {

    setSelectedHours(
      selectedHours.filter(
        h => h !== hour
      )
    );

    return;
  }

  setSelectedHours([
    ...selectedHours,
    hour,
  ]);
}

  useEffect(() => {

    if (isOpen) {
      loadProfile();
    }

  }, [isOpen]);

  if (!isOpen) {
    return null;
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
          rounded-2xl
          w-full
          max-w-xl
          p-8
        "
      >

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-semibold">
            Perfil
          </h2>

          <button
            onClick={onClose}
            className="text-zinc-500"
          >
            ✕
          </button>

        </div>

        <div className="mt-8 flex items-center gap-4">

  {selectedFile ? (

    <img
      src={URL.createObjectURL(selectedFile)}
      alt="Preview"
      className="
        h-20
        w-20
        rounded-full
        object-cover
      "
    />

  ) : profile?.avatarUrl ? (

    <img
      src={`http://localhost:3333/uploads/${profile.avatarUrl}`}
      alt={profile.name}
      className="
        h-20
        w-20
        rounded-full
        object-cover
      "
      onError={() =>
        console.log(
          "Erro ao carregar:",
          profile.avatarUrl
        )
      }
    />

  ) : (

    <div
      className="
        h-20
        w-20
        rounded-full
        bg-blue-600
        text-white
        flex
        items-center
        justify-center
        text-2xl
        font-semibold
      "
    >
      {name
        ?.split(" ")
        .map(word => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </div>

  )}

  <div>

    <button
      type="button"
      onClick={() =>
        fileInputRef.current?.click()
      }
      className="
        bg-zinc-900
        text-white
        px-4
        py-2
        rounded-lg
      "
    >
      Nova imagem
    </button>

    <input
      type="file"
      ref={fileInputRef}
      hidden
      accept="image/*"
      onChange={(event) => {

        const file =
          event.target.files?.[0];

        if (file) {
          setSelectedFile(file);
        }

      }}
    />

  </div>

</div>

        <div className="mt-8">

          <label
            className="
              text-sm
              text-zinc-500
            "
          >
            Nome
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="
              w-full
              border
              border-zinc-300
              rounded-lg
              px-4
              py-3
              mt-2
            "
          />

        </div>

        <div className="mt-6">

          <label
            className="
              text-sm
              text-zinc-500
            "
          >
            E-mail
          </label>

          <input
            value={profile?.email || ""}
            disabled
            className="
              w-full
              border
              border-zinc-300
              rounded-lg
              px-4
              py-3
              mt-2
              bg-zinc-100
            "
          />

        </div>

        <div className="mt-6">

          <label
            className="
              text-sm
              text-zinc-500
            "
          >
            Senha
          </label>

          <div className="flex gap-3 mt-2">

            <input
              value="********"
              disabled
              className="
                flex-1
                border
                border-zinc-300
                rounded-lg
                px-4
                py-3
                bg-zinc-100
              "
            />

            <button
  onClick={() =>
    setShowPasswordModal(true)
  }
  className="
    px-4
    py-3
    rounded-lg
    border
    border-zinc-300
  "
>
  Alterar
</button>

          </div>

          {user?.role === "technician" && (

  <div className="mt-10">

    <div>

      <p className="font-medium">
        Disponibilidade
      </p>

      <p className="text-sm text-zinc-500 mt-1">
        Horários de atendimento
      </p>

    </div>

    <div className="flex flex-wrap gap-3 mt-4">

      {availableHours.map(hour => (

        <button
          key={hour}
          type="button"
          onClick={() =>
            toggleHour(hour)
          }
          className={`
            px-4
            py-2
            rounded-full
            border
            transition

            ${
              selectedHours.includes(
                hour
              )
                ? `
                  bg-zinc-900
                  text-white
                  border-zinc-900
                `
                : `
                  bg-white
                  text-zinc-600
                  border-zinc-300
                  hover:border-zinc-500
                `
            }
          `}
        >
          {hour}
        </button>

      ))}

    </div>

  </div>

)}

        </div>

        <button
          onClick={handleSave}
          className="
            w-full
            mt-8
            bg-[#3347B0]
            text-white
            py-3
            rounded-lg
            hover:opacity-90
          "
        >
          Salvar
        </button>

      </div>

      <ChangePasswordModal
  isOpen={showPasswordModal}
  onClose={() =>
    setShowPasswordModal(false)
  }
/>

    </div>
  );
}