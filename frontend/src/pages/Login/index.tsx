import { Link } from "react-router-dom"

import logo from "../../assets/logo-helpdesk.png"
import bgLogin from "../../assets/bg-login.png"

export function Login() {
  return (
    <main className="relative min-h-screen overflow-hidden">

  <img
    src={bgLogin}
    alt=""
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
    "
  />

  <div
    className="
      relative
      ml-auto
      mt-5
      h-[calc(100vh-20px)]
      w-full
      lg:w-[55%]
      bg-[#F5F5F5]
      rounded-tl-[28px]
      flex
      justify-center
      px-6
    "
  >
        {/* Conteúdo */}
        <div className="w-full max-w-md pt-10">

          <div className="w-full max-w-md">

            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="HelpDesk"
                className="h-10"
              />
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-6">

              <h2 className="font-semibold text-xl">
                Acesse o portal
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Entre usando seu e-mail e senha cadastrados
              </p>

              <form className="mt-8 space-y-6">

                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2">
                    E-mail
                  </label>

                  <input
                    type="email"
                    placeholder="exemplo@mail.com"
                    className="
                      w-full
                      border-b
                      border-zinc-300
                      bg-transparent
                      py-2
                      outline-none
                    "
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2">
                    Senha
                  </label>

                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    className="
                      w-full
                      border-b
                      border-zinc-300
                      bg-transparent
                      py-2
                      outline-none
                    "
                  />
                </div>

                <button
                  type="submit"
                  className="
                    w-full
                    h-11
                    rounded
                    bg-zinc-900
                    text-white
                    hover:bg-zinc-800
                    transition
                  "
                >
                  Entrar
                </button>

              </form>
            </div>

            <div className="bg-white border border-zinc-200 rounded-lg p-6 mt-4">

              <h3 className="font-semibold">
                Ainda não tem uma conta?
              </h3>

              <p className="text-sm text-zinc-500">
                Cadastre agora mesmo
              </p>

              <Link
                to="/register"
                className="
                  mt-4
                  h-11
                  rounded
                  bg-zinc-200
                  flex
                  items-center
                  justify-center
                  hover:bg-zinc-300
                  transition
                "
              >
                Criar conta
              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>
  )
}