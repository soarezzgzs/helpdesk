import { Link, useNavigate } from "react-router-dom"
import {api} from "../../services/api"

import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"

import {useAuth} from "../../contexts/AuthContext"

import logo from "../../assets/logo-helpdesk.png"
import bgLogin from "../../assets/bg-login.png"


export function Login() {

  const navigate = useNavigate()

  const {signIn} = useAuth()

  const loginSchema = z.object({
    email: z.string().email({message: "E-mail inválido."}).toLowerCase(),
    password: z.string().min(1, {message: "Informe a senha."})
  })
  
  type LoginSchema = z.infer<typeof loginSchema>
  
  const {register, handleSubmit, formState: {errors}} = useForm<LoginSchema>({resolver: zodResolver(loginSchema)})

  async function handleLogin(data: LoginSchema) {
    try {
      const response = await api.post("/login", {
        email: data.email,
        password: data.password
      })

      signIn(response.data.token, response.data.user)

      const role = response.data.user.role

      if(role === "admin") {
        navigate("/tickets/admin")
      } 
      
      if (role === "technician") {
        navigate("/tickets/assigned")
      } 
      
      if(role === "client") {
        navigate("/tickets/my-tickets")
      }

    } catch (error) {
      console.log(error)
    }
  }

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

              <form onSubmit={handleSubmit(handleLogin)} className="mt-8 space-y-6">

                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2">
                    E-mail
                  </label>

                  <input
                    type="email"
                    placeholder="exemplo@mail.com"
                    {...register("email")}
                    className="
                      w-full
                      border-b
                      border-zinc-300
                      bg-transparent
                      py-2
                      outline-none
                    "
                  />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                </div>


                <div>
                  <label className="block text-xs uppercase text-zinc-500 mb-2">
                    Senha
                  </label>

                  <input
                    type="password"
                    placeholder="Digite sua senha"
                    {...register("password")}
                    className="
                      w-full
                      border-b
                      border-zinc-300
                      bg-transparent
                      py-2
                      outline-none
                    "
                  />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
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