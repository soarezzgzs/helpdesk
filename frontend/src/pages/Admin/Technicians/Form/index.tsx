import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AppLayout } from "../../../../layouts/AppLayout";
import { api, API_URL } from "../../../../services/api";

import { ArrowLeft } from "lucide-react";

const morningHours = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
];

const afternoonHours = [
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const eveningHours = [
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

export function TechnicianForm() {

  const navigate = useNavigate();

  const { id } = useParams();

  const editing = !!id;

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [selectedHours, setSelectedHours] =
    useState<string[]>([]);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);


  function toggleHour(hour: string) {

    if (
      selectedHours.includes(hour)
    ) {

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

  async function loadTechnician() {

    if (!id) return;

    try {

      const response =
        await api.get(
          `/technicians/admin/${id}`
        );

      setName(response.data.name);

      setEmail(response.data.email);

      setAvatarUrl(response.data.avatarUrl);

      const availabilityResponse =
        await api.get(
          `/technicians/availability/${id}`
        );

      setSelectedHours(
        availabilityResponse.data.map(
          (item: any) => item.hour
        )
      );

    } catch (error) {
      console.log(error);
    }
  }

  async function handleSave() {

    try {

      if (!editing) {

        const response =
          await api.post(
            "/technicians/admin/new",
            {
              name,
              email,
              password,
            }
          );

        const createdTechnician =
          response.data;

        await api.patch(
          `/technicians/availability/${createdTechnician.id}`,
          {
            hours: selectedHours,
          }
        );

      } else {

        await api.put(
          `/technicians/admin/edit/${id}`,
          {
            name,
            email,
          }
        );

        await api.patch(
          `/technicians/availability/${id}`,
          {
            hours: selectedHours,
          }
        );
      }

      navigate(
        "/technicians/admin"
      );

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadTechnician();
  }, []);

  function HourButton({
    hour,
  }: {
    hour: string;
  }) {

    const selected =
      selectedHours.includes(hour);

    return (

      <button
        type="button"
        onClick={() =>
          toggleHour(hour)
        }
        className={`
          px-3
          py-1.5
          rounded-full
          border
          text-xs
          transition

          ${
            selected
              ? `
                bg-[#5A6BF0]
                border-[#5A6BF0]
                text-white
              `
              : `
                bg-white
                border-zinc-300
                text-zinc-600
              `
          }
        `}
      >
        {hour}
      </button>

    );
  }

  return (
    <AppLayout>

      <div className="max-w-6xl mx-auto px-1 md:px-0">

        <Link
          to="/technicians/admin"
          className="
            inline-flex
            mb-2
            items-center
            gap-2
            text-sm
            text-zinc-500
            hover:text-[#3347B0]
          "
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>

        <div
  className="
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between
    gap-4
    mt-4
  "
>

          <h1
            className="
              text-2xl
              md:text-4xl
              font-semibold
              text-[#3347B0]
            "
          >
            Perfil de técnico
          </h1>

          <div
  className="
    grid
    grid-cols-2
    gap-3
    w-full
    md:w-auto
    md:flex
  "
>

            <button
              onClick={() =>
                navigate(
                  "/technicians/admin"
                )
              }
              className="
                px-4
                py-2
                rounded-lg
                bg-zinc-100
              "
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="
                px-4
                py-2
                rounded-lg
                bg-zinc-900
                text-white
              "
            >
              Salvar
            </button>

          </div>

        </div>

        <div
  className="
    grid
    grid-cols-1
    xl:grid-cols-2
    gap-6
    mt-6
    md:mt-8
  "
>


          <div
            className="
              bg-white
              rounded-xl
              border
              border-zinc-200
              p-4
              md:p-6
            "
          >

            <h3 className="font-semibold">
              Dados pessoais
            </h3>

            <p
              className="
                text-sm
                text-zinc-500
                mt-1
              "
            >
              Defina as informações
              do perfil do técnico
            </p>

            <div className="mt-8">

              {editing && (

  <div className="mt-6 mb-6 flex justify-start">

    {avatarUrl ? (

      <img
        src={`${API_URL}/uploads/${avatarUrl}`}
        alt={name}
        className="
          h-16
          w-16
          md:h-20
          md:w-20
          rounded-full
          object-cover
          border
          "
      />

    ) : (

      <div
        className="
          h-20
          w-20
          rounded-full
          bg-blue-700
          text-white
          flex
          items-center
          justify-center
          text-xl
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

  </div>

)}

              <label
                className="
                  text-xs
                  text-zinc-500
                "
              >
                NOME
              </label>

              <input
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border-b
                  py-2
                  md:py-3
                  outline-none
                "
              />

            </div>

            <div className="mt-6">

              <label
                className="
                  text-xs
                  text-zinc-500
                "
              >
                E-MAIL
              </label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                className="
                  w-full
                  border-b
                  py-2
                  md:py-3
                  outline-none
                "
              />

            </div>

            {!editing && (

              <div className="mt-6">

                <label
                  className="
                    text-xs
                    text-zinc-500
                  "
                >
                  SENHA
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    border-b
                    py-2
                    md:py-3
                    outline-none
                  "
                />

                <p
                  className="
                    text-xs
                    text-zinc-500
                    mt-2
                  "
                >
                  Mínimo de 6 dígitos
                </p>

              </div>

            )}

          </div>

          <div
            className="
              bg-white
              rounded-xl
              border
              border-zinc-200
              p-4
              md:p-6
            "
          >

            <h3 className="font-semibold">
              Horários de atendimento
            </h3>

            <p
              className="
                text-sm
                text-zinc-500
                mt-1
              "
            >
              Selecione os horários
              de disponibilidade
            </p>

            <div className="mt-6">

              <p
                className="
                  text-xs
                  font-medium
                  text-zinc-500
                "
              >
                MANHÃ
              </p>

              <div
  className="
    flex
    flex-wrap
    gap-2
    mt-2
  "
>

                {morningHours.map(hour => (

                  <HourButton
                    key={hour}
                    hour={hour}
                  />

                ))}

              </div>

            </div>

            <div className="mt-6">

              <p
                className="
                  text-xs
                  font-medium
                  text-zinc-500
                "
              >
                TARDE
              </p>

              <div className="flex flex-wrap gap-2 mt-2">

                {afternoonHours.map(hour => (

                  <HourButton
                    key={hour}
                    hour={hour}
                  />

                ))}

              </div>

            </div>

            <div className="mt-6">

              <p
                className="
                  text-xs
                  font-medium
                  text-zinc-500
                "
              >
                NOITE
              </p>

              <div className="flex flex-wrap gap-2 mt-2">

                {eveningHours.map(hour => (

                  <HourButton
                    key={hour}
                    hour={hour}
                  />

                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </AppLayout>
  );
}