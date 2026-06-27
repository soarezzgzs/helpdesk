import { Router } from "express"

import { ClientsController } from "../controllers/clients.controller"

import { verifyAuthorization } from "../middlewares/verifyAuthorization.middleware"

const clientRoutes = Router()

const usersController = new ClientsController()

clientRoutes.get("/", verifyAuthorization(["admin"]) ,usersController.index)
clientRoutes.put("/:id", verifyAuthorization(["admin", "client"]), usersController.update)
clientRoutes.patch("/password/:id", verifyAuthorization(["admin", "client"]), usersController.updatePassword)
clientRoutes.delete("/:id", verifyAuthorization(["admin"]), usersController.delete)

export { clientRoutes }
