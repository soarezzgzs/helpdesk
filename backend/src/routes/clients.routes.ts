import { Router } from "express"

import { ClientsController } from "../controllers/clients.controller"


const clientRoutes = Router()

// Instanciando o controller de cliente
const usersController = new ClientsController()

// Rota para Cliente
clientRoutes.post("/", usersController.create)

export { clientRoutes }
